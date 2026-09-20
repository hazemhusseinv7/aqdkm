"use client";

import { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { MdSend } from "react-icons/md";
import { submitContactMessage } from "@/sanity/lib/actions";

export function ContactForm() {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = `${formData.get("name") ?? ""}`.trim();
    const phone = `${formData.get("phone") ?? ""}`.trim();
    const email = `${formData.get("email") ?? ""}`.trim();
    const message = `${formData.get("message") ?? ""}`.trim();
    setSending(true);
    try {
      await submitContactMessage({ name, phone, email, message });
      form.reset();
      toast("تم استلام رسالتك بنجاح", {
        description: "سنرد عليك في أقرب وقت ممكن.",
      });
    } catch {
      toast("تعذر إرسال الرسالة", {
        description: "تحقق من الاتصال وحاول مجدداً.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Form
      aria-label="نموذج التواصل"
      validationBehavior="aria"
      className="flex min-w-0 flex-col gap-4"
      onSubmit={onSubmit}
    >
      <TextField isRequired name="name" minLength={2}>
        <Label>الاسم</Label>
        <Input placeholder="الاسم كامل" />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        name="phone"
        type="tel"
        validate={(value) => {
          if (!value) return null;
          const digits = value.replace(/\D/g, "");
          if (digits.length < 9 || digits.length > 12) {
            return "يرجى إدخال رقم جوال صحيح";
          }
          return null;
        }}
      >
        <Label>رقم الجوال</Label>
        <Input placeholder="05xxxxxxxx" dir="ltr" />
        <FieldError />
      </TextField>
      <TextField
        name="email"
        type="email"
        validate={(value) => {
          if (
            value &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ) {
            return "يرجى إدخال بريد إلكتروني صحيح";
          }
          return null;
        }}
      >
        <Label>البريد الإلكتروني (اختياري)</Label>
        <Input placeholder="name@example.com" dir="ltr" />
        <FieldError />
      </TextField>
      <TextField isRequired name="message" minLength={10}>
        <Label>الرسالة</Label>
        <TextArea placeholder="اكتب رسالتك هنا…" rows={5} />
        <FieldError />
      </TextField>
      <div>
        <Button type="submit" isDisabled={sending} className="min-w-32">
          {sending ? (
            <Spinner size="sm" />
          ) : (
            <MdSend className="size-4 -scale-x-100" />
          )}
          {sending ? "جارٍ الإرسال…" : "إرسال الرسالة"}
        </Button>
      </div>
    </Form>
  );
}
