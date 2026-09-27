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
import { validateContact, type ContactErrors } from "@/lib/validation";

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const input = {
      name: `${formData.get("name") ?? ""}`.trim(),
      phone: `${formData.get("phone") ?? ""}`.trim(),
      email: `${formData.get("email") ?? ""}`.trim(),
      message: `${formData.get("message") ?? ""}`.trim(),
    };
    const errs = validateContact(input);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("يرجى مراجعة الحقول المطلوبة", {
        description: "بعض الحقول غير مكتملة أو بصيغة غير صحيحة",
      });
      return;
    }
    setSending(true);
    try {
      await submitContactMessage(input);
      form.reset();
      setErrors({});
      toast("تم استلام رسالتك بنجاح", {
        description: "سنرد عليك في أقرب وقت ممكن.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.startsWith("validation: ")) {
        toast("تعذر إرسال الرسالة", {
          description: message.replace(/^validation: /, ""),
        });
      } else {
        toast("تعذر إرسال الرسالة", {
          description: "تحقق من الاتصال وحاول مجدداً.",
        });
      }
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
      <TextField
        isRequired
        name="name"
        isInvalid={!!errors.name}
        onChange={() => setErrors((p) => ({ ...p, name: undefined }))}
      >
        <Label>الاسم</Label>
        <Input placeholder="الاسم كامل" />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </TextField>
      <TextField
        isRequired
        name="phone"
        type="tel"
        isInvalid={!!errors.phone}
        onChange={() => setErrors((p) => ({ ...p, phone: undefined }))}
      >
        <Label>رقم الجوال</Label>
        <Input placeholder="05xxxxxxxx" dir="ltr" />
        {errors.phone && <FieldError>{errors.phone}</FieldError>}
      </TextField>
      <TextField
        name="email"
        type="email"
        isInvalid={!!errors.email}
        onChange={() => setErrors((p) => ({ ...p, email: undefined }))}
      >
        <Label>البريد الإلكتروني (اختياري)</Label>
        <Input placeholder="name@example.com" dir="ltr" />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </TextField>
      <TextField
        isRequired
        name="message"
        isInvalid={!!errors.message}
        onChange={() => setErrors((p) => ({ ...p, message: undefined }))}
      >
        <Label>الرسالة</Label>
        <TextArea placeholder="اكتب رسالتك هنا…" rows={5} />
        {errors.message && <FieldError>{errors.message}</FieldError>}
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
