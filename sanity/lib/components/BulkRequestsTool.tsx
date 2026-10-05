import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";

import { apiVersion } from "../../env";
import { STATUSES } from "../../schemaTypes/rentalRequest";

type RequestRow = {
  _id: string;
  requestNo: string;
  contractType: string;
  status: string;
  submittedAt: string;
};

const STATUS_TONES = {
  new: "default",
  reviewing: "caution",
  approved: "primary",
  completed: "positive",
  cancelled: "critical",
} as const;

const CONTRACT_TYPES = [
  { title: "Residential", value: "residential" },
  { title: "Commercial", value: "commercial" },
];

function statusTitle(value: string): string {
  return STATUSES.find((s) => s.value === value)?.title ?? value;
}

export function AdvancedRequestsTool() {
  const client = useClient({ apiVersion });
  const [notice, setNotice] = useState<{
    tone: "positive" | "critical";
    title: string;
    description?: string;
  } | null>(null);
  const [rows, setRows] = useState<RequestRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetStatus, setTargetStatus] = useState("reviewing");
  const [busy, setBusy] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setRows(null);
    setLoadError(null);
    setSelected(new Set());
    setReloadToken((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const filters = ['_type == "rentalRequest"', '!(_id in path("drafts.**"))'];
    const params: Record<string, string> = {};
    if (statusFilter) {
      filters.push("status == $status");
      params.status = statusFilter;
    }
    if (typeFilter) {
      filters.push("contractType == $contractType");
      params.contractType = typeFilter;
    }
    client
      .fetch<RequestRow[]>(
        `*[${filters.join(" && ")}] | order(submittedAt desc) { _id, requestNo, contractType, status, submittedAt }`,
        params,
      )
      .then(
        (data) => {
          if (!cancelled) setRows(data ?? []);
        },
        (e: unknown) => {
          if (!cancelled)
            setLoadError(
              e instanceof Error ? e.message : "Failed to load requests",
            );
        },
      );
    return () => {
      cancelled = true;
    };
  }, [client, statusFilter, typeFilter, reloadToken]);

  const list = useMemo(() => rows ?? [], [rows]);
  const allSelected = list.length > 0 && selected.size === list.length;

  const toggleAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === list.length ? new Set() : new Set(list.map((r) => r._id)),
    );
  }, [list]);

  const toggleOne = useCallback((id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const applyStatus = useCallback(async () => {
    const ids = [...selected];
    if (ids.length === 0 || busy) return;
    if (!STATUSES.some((s) => s.value === targetStatus)) return;
    setBusy(true);
    setNotice(null);
    try {
      const tx = client.transaction();
      for (const id of ids) tx.patch(id, { set: { status: targetStatus } });
      await tx.commit();
      setNotice({
        tone: "positive",
        title: `Updated ${ids.length} request(s) to ${statusTitle(targetStatus)}`,
      });
      setSelected(new Set());
      reload();
    } catch (e) {
      setNotice({
        tone: "critical",
        title: "Bulk status update failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  }, [client, selected, targetStatus, busy, reload]);

  const deleteConfirmed = deleteConfirm.trim() === String(selected.size);
  const deleteSelected = useCallback(async () => {
    const ids = [...selected];
    if (ids.length === 0 || busy || !deleteConfirmed) return;
    setBusy(true);
    setNotice(null);
    try {
      const tx = client.transaction();
      for (const id of ids) tx.delete(id);
      await tx.commit();
      setNotice({
        tone: "positive",
        title: `Deleted ${ids.length} request(s)`,
      });
      setDeleteConfirm("");
      reload();
    } catch (e) {
      setNotice({
        tone: "critical",
        title: "Bulk delete failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  }, [client, selected, busy, deleteConfirmed, reload]);

  return (
    <Container width={2}>
      <Box padding={4}>
        <Stack gap={4}>
          <Text size={3} weight="bold">
            Advanced
          </Text>

          {notice && (
            <Card tone={notice.tone} padding={3} radius={2}>
              <Stack gap={2}>
                <Text weight="semibold">{notice.title}</Text>
                {notice.description && (
                  <Text size={1}>{notice.description}</Text>
                )}
              </Stack>
            </Card>
          )}

          <Flex gap={3} wrap="wrap">
            <Box flex={1} style={{ minWidth: 160 }}>
              <Stack gap={2}>
                <Text size={1} muted>
                  Status
                </Text>
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.currentTarget.value);
                    reload();
                  }}
                >
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.title}
                    </option>
                  ))}
                </Select>
              </Stack>
            </Box>
            <Box flex={1} style={{ minWidth: 160 }}>
              <Stack gap={2}>
                <Text size={1} muted>
                  Type
                </Text>
                <Select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.currentTarget.value);
                    reload();
                  }}
                >
                  <option value="">All types</option>
                  {CONTRACT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.title}
                    </option>
                  ))}
                </Select>
              </Stack>
            </Box>
          </Flex>

          {rows === null && !loadError ? (
            <Flex justify="center" padding={4}>
              <Spinner />
            </Flex>
          ) : loadError ? (
            <Card tone="critical" padding={3} radius={2}>
              <Stack gap={3}>
                <Text>{loadError}</Text>
                <Button text="Retry" onClick={() => reload()} />
              </Stack>
            </Card>
          ) : list.length === 0 ? (
            <Card border padding={4} radius={2}>
              <Text muted align="center">
                No requests match the current filters.
              </Text>
            </Card>
          ) : (
            <Stack gap={2}>
              <Flex align="center" gap={3}>
                <Checkbox checked={allSelected} onChange={toggleAll} />
                <Text size={1} muted>
                  {selected.size} of {list.length} selected
                </Text>
              </Flex>
              {list.map((row) => (
                <Card key={row._id} border padding={3} radius={2}>
                  <Flex align="center" gap={3}>
                    <Checkbox
                      checked={selected.has(row._id)}
                      onChange={(e) =>
                        toggleOne(row._id, e.currentTarget.checked)
                      }
                    />
                    <Box flex={1}>
                      <Text weight="semibold">{row.requestNo}</Text>
                      <Text size={1} muted>
                        {row.contractType} ·{" "}
                        {new Date(row.submittedAt).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Badge
                      tone={
                        STATUS_TONES[
                          row.status as keyof typeof STATUS_TONES
                        ] ?? "default"
                      }
                    >
                      {statusTitle(row.status)}
                    </Badge>
                  </Flex>
                </Card>
              ))}
            </Stack>
          )}

          <Card border padding={3} radius={2}>
            <Stack gap={3}>
              <Text weight="semibold">
                Change status of {selected.size} selected
              </Text>
              <Flex gap={3} wrap="wrap" align="flex-end">
                <Box flex={1} style={{ minWidth: 160 }}>
                  <Select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.currentTarget.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.title}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Button
                  text={busy ? "Working…" : `Apply to ${selected.size}`}
                  tone="primary"
                  disabled={selected.size === 0 || busy}
                  onClick={() => void applyStatus()}
                />
              </Flex>
            </Stack>
          </Card>

          <Card border padding={3} radius={2} tone="critical">
            <Stack gap={3}>
              <Text weight="semibold">
                Delete {selected.size} selected
              </Text>
              <Text size={1} muted>
                Type {selected.size} to confirm. This cannot be undone.
              </Text>
              <Flex gap={3} wrap="wrap" align="flex-end">
                <Box flex={1} style={{ minWidth: 160 }}>
                  <TextInput
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.currentTarget.value)}
                    placeholder={`Type ${selected.size} to confirm`}
                  />
                </Box>
                <Button
                  text={busy ? "Working…" : `Delete ${selected.size}`}
                  tone="critical"
                  disabled={
                    selected.size === 0 || busy || !deleteConfirmed
                  }
                  onClick={() => void deleteSelected()}
                />
              </Flex>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
