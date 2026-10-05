"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Chip, Tabs, buttonVariants } from "@heroui/react";
import { SharedElementTransition } from "react-aria-components";
import {
  MdCheckCircle,
  MdArrowBack,
  MdPayments,
  MdRateReview,
} from "react-icons/md";
import { FaBuilding, FaFileContract, FaHome, FaLandmark } from "react-icons/fa";
import { PiSpeedometerFill } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { HiDocumentCheck } from "react-icons/hi2";

export function ContractTypeTabs() {
  const [key, setKey] = useState("res");
  const [animReady, setAnimReady] = useState(false);
  useEffect(() => {
    let on = true;
    Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(() => {
      if (on) setAnimReady(true);
    });
    return () => {
      on = false;
    };
  }, []);
  const pill = (id: string) =>
    animReady ? (
      <Tabs.Indicator />
    ) : (
      key === id && (
        <span
          data-slot="tabs-indicator"
          className="tabs__indicator"
          aria-hidden="true"
        />
      )
    );
  return (
    <div id="contract-type" className="w-full scroll-mt-24">
      <SharedElementTransition>
        <Tabs
          className="w-full"
          selectedKey={key}
          onSelectionChange={(k) => setKey(String(k))}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="نوع العقد">
              <Tabs.Tab id="res">
                <span className="flex items-center gap-2">
                  <FaHome aria-hidden="true" /> سكني
                </span>
                {pill("res")}
              </Tabs.Tab>
              <Tabs.Tab id="com">
                <span className="flex items-center gap-2">
                  <FaBuilding aria-hidden="true" /> تجاري
                </span>
                {pill("com")}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="res">
            <TypeCard
              href="/residential"
              icon={<FaHome className="size-7" aria-hidden="true" />}
              title="عقد إيجار سكني معتمد"
              desc="للشقق والفلل والأدوار - بما فيها تفاصيل السكن"
              cta="وثّق عقدك السكني الآن"
              points={[
                {
                  text: "وسيط عقاري معتمد رسمياً عبر منصة إيجار",
                  icon: <RiVerifiedBadgeFill aria-hidden="true" />,
                },
                {
                  text: "ادفع بعد معاينة نسخة العقد والتأكد من البيانات",
                  icon: <MdPayments aria-hidden="true" />,
                },
                {
                  text: "توثيق إلكتروني فوري بدون الحاجة لزيارة مكتب",
                  icon: <HiDocumentCheck aria-hidden="true" />,
                },
              ]}
            />
          </Tabs.Panel>
          <Tabs.Panel id="com">
            <TypeCard
              href="/commercial"
              icon={<FaBuilding className="size-7" aria-hidden="true" />}
              title="عقد إيجار تجاري معتمد"
              desc="للمحلات والمكاتب والمستودعات - للأفراد والمنشآت"
              cta="وثّق عقدك التجاري الآن"
              points={[
                {
                  text: "معتمد لدى بلدي، وزارة التجارة، والجهات الحكومية",
                  icon: <FaLandmark aria-hidden="true" />,
                },
                {
                  text: "معاينة نسخة العقد أولاً قبل إتمام عملية الدفع",
                  icon: <MdRateReview aria-hidden="true" />,
                },
                {
                  text: "إنجاز سريع ومضمون",
                  icon: <PiSpeedometerFill aria-hidden="true" />,
                },
              ]}
            />
          </Tabs.Panel>
        </Tabs>
      </SharedElementTransition>
    </div>
  );
}

function TypeCard({
  href,
  icon,
  title,
  desc,
  cta,
  points,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  points: { text: string; icon?: React.ReactNode }[];
}) {
  return (
    <Card variant="secondary" className="mt-3">
      <Card.Header className="gap-3">
        <span className="bg-accent text-accent-foreground shadow-accent/25 flex size-14 items-center justify-center rounded-2xl shadow-md">
          {icon}
        </span>
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Description>{desc}</Card.Description>
        </div>
        <Chip color="success" variant="soft" className="ms-auto">
          <FaFileContract aria-hidden="true" /> نموذج ذكي
        </Chip>
      </Card.Header>
      <Card.Content>
        <ul className="flex flex-col gap-1.5">
          {points.map((p, i) => (
            <li
              key={`${p.text}-${i}`}
              className="text-muted flex items-center gap-2 text-sm"
            >
              <span className="text-accent inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
                {p.icon ?? <MdCheckCircle aria-hidden="true" />}
              </span>
              {p.text}
            </li>
          ))}
        </ul>
      </Card.Content>
      <Card.Footer>
        <Link
          href={href}
          className={buttonVariants({
            variant: "primary",
            className: "w-full",
          })}
        >
          {cta}
          <MdArrowBack className="size-4" aria-hidden="true" />
        </Link>
      </Card.Footer>
    </Card>
  );
}
