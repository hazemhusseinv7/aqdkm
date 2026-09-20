"use client";

import {
  Surface,
  Separator,
  Typography,
  Button,
  Drawer,
  Popover,
  Chip,
} from "@heroui/react";
import { MdReceiptLong, MdInfo } from "react-icons/md";
import { formatCurrency, type ContractType, type FeeConfig } from "@/lib/fees";

export function FeeSummary({
  contractType,
  annualRent,
  durationLabel,
  fee,
  payerLabel,
  feeConfig,
}: {
  contractType: ContractType;
  annualRent: number;
  durationLabel: string;
  fee: number;
  payerLabel: string;
  feeConfig: FeeConfig;
}) {
  return (
    <>
      <Surface
        variant="default"
        className="hidden shrink-0 flex-col gap-3 rounded-3xl p-5 lg:flex"
      >
        <FeeBody
          contractType={contractType}
          annualRent={annualRent}
          durationLabel={durationLabel}
          fee={fee}
          payerLabel={payerLabel}
          feeConfig={feeConfig}
        />
      </Surface>

      <div className="sticky bottom-3 z-30 lg:hidden">
        <Drawer>
          <Button variant="primary" className="w-full shadow-lg">
            <MdReceiptLong className="size-4" />
            الرسوم التقديرية: {formatCurrency(fee)} - عرض التفاصيل
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="bottom">
              <Drawer.Dialog>
                <Drawer.Handle />
                <Drawer.CloseTrigger />
                <Drawer.Header>
                  <Drawer.Heading>رسوم التوثيق التقديرية</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  <FeeBody
                    contractType={contractType}
                    annualRent={annualRent}
                    durationLabel={durationLabel}
                    fee={fee}
                    payerLabel={payerLabel}
                    feeConfig={feeConfig}
                  />
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}

function FeeBody({
  contractType,
  annualRent,
  durationLabel,
  fee,
  payerLabel,
  feeConfig,
}: {
  contractType: ContractType;
  annualRent: number;
  durationLabel: string;
  fee: number;
  payerLabel: string;
  feeConfig: FeeConfig;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-semibold">
          <MdReceiptLong className="text-accent size-5" />
          رسوم التوثيق التقديرية
        </span>
        <Popover>
          <Button
            isIconOnly
            aria-label="طريقة الاحتساب"
            size="sm"
            variant="tertiary"
          >
            <MdInfo className="size-4" />
          </Button>
          <Popover.Content className="max-w-64">
            <Popover.Dialog>
              <Popover.Arrow />
              <Popover.Heading>طريقة الاحتساب</Popover.Heading>
              <p className="text-muted mt-1 text-sm">
                {contractType === "residential" ? (
                  <>
                    رسوم تقديرية:{" "}
                    {formatCurrency(
                      feeConfig.residentialGov + feeConfig.residentialCompany,
                    )}{" "}
                    عن كل سنة، وأي جزء من السنة يُحتسب سنة كاملة.
                  </>
                ) : (
                  <>
                    رسوم تقديرية:{" "}
                    {formatCurrency(
                      feeConfig.commercialFirstGov +
                        feeConfig.commercialFirstCompany,
                    )}{" "}
                    للسنة الأولى و{" "}
                    {formatCurrency(
                      feeConfig.commercialExtraGov +
                        feeConfig.commercialExtraCompany,
                    )}{" "}
                    عن كل سنة إضافية، وأي جزء من السنة يُحتسب سنة كاملة.
                  </>
                )}{" "}
                وقد تختلف عند المراجعة النهائية.
              </p>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
      <Separator />
      <div className="flex justify-between text-sm">
        <Typography type="body-sm" color="muted">
          الإيجار السنوي
        </Typography>
        <span className="flex items-center gap-1 font-semibold">
          {formatCurrency(annualRent || 0)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <Typography type="body-sm" color="muted">
          المدة
        </Typography>
        <Chip variant="soft" size="sm">
          {durationLabel}
        </Chip>
      </div>
      <div className="flex justify-between text-sm">
        <Typography type="body-sm" color="muted">
          المتحمل للرسوم
        </Typography>
        <span className="font-medium">{payerLabel}</span>
      </div>
      <Separator />
      <div className="bg-accent/10 flex items-center justify-between rounded-2xl p-3">
        <Typography type="body-sm" weight="semibold">
          إجمالي رسوم التوثيق التقديرية
        </Typography>
        <Typography type="h4" weight="bold">
          {formatCurrency(fee)}
        </Typography>
      </div>
    </div>
  );
}
