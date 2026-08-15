"use client";

import {
  CalendarDays,
  FileText,
  Globe2,
  Mail,
  Phone,
  User,
} from "lucide-react";

export interface PassengerFormData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  contactNumber: string;
}

interface PassengerFormProps {
  index: number;
  value: PassengerFormData;
  errors: Record<string, string>;
  onChange: (
    field: keyof PassengerFormData,
    value: string
  ) => void;
}

export default function PassengerForm({
  index,
  value,
  errors,
  onChange,
}: PassengerFormProps) {
  const getError = (field: keyof PassengerFormData) => {
    return errors[`${index}.${field}`];
  };

  const inputClass = (field: keyof PassengerFormData) => {
    const hasError = Boolean(getError(field));

    return `
      w-full
      rounded-xl
      border
      bg-white
      py-3.5
      pl-11
      pr-4
      text-sm
      text-slate-900
      placeholder:text-slate-400
      placeholder:opacity-100
      outline-none
      transition
      focus:ring-4
      ${
        hasError
          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-blue-600 focus:ring-blue-100"
      }
    `;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {/* ================================================= */}
      {/* CARD HEADER */}
      {/* ================================================= */}

      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <User size={21} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Passenger {index + 1}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter passenger details exactly as shown on the
            travel document.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <div className="grid gap-5 md:grid-cols-2">
        {/* ================================================= */}
        {/* FULL NAME */}
        {/* ================================================= */}

        <div className="md:col-span-2">
          <label
            htmlFor={`passenger-${index}-fullName`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Full name
          </label>

          <div className="relative">
            <User
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id={`passenger-${index}-fullName`}
              name={`passenger-${index}-fullName`}
              type="text"
              value={value.fullName}
              onChange={(event) =>
                onChange("fullName", event.target.value)
              }
              placeholder="Enter full name"
              autoComplete="name"
              className={inputClass("fullName")}
            />
          </div>

          {getError("fullName") && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {getError("fullName")}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* DATE OF BIRTH */}
        {/* ================================================= */}

        <div>
          <label
            htmlFor={`passenger-${index}-dateOfBirth`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Date of birth
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id={`passenger-${index}-dateOfBirth`}
              name={`passenger-${index}-dateOfBirth`}
              type="date"
              value={value.dateOfBirth}
              onChange={(event) =>
                onChange(
                  "dateOfBirth",
                  event.target.value
                )
              }
              className={inputClass("dateOfBirth")}
            />
          </div>

          {getError("dateOfBirth") && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {getError("dateOfBirth")}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* NATIONALITY */}
        {/* ================================================= */}

        <div>
          <label
            htmlFor={`passenger-${index}-nationality`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Nationality
          </label>

          <div className="relative">
            <Globe2
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id={`passenger-${index}-nationality`}
              name={`passenger-${index}-nationality`}
              type="text"
              value={value.nationality}
              onChange={(event) =>
                onChange(
                  "nationality",
                  event.target.value
                )
              }
              placeholder="e.g. Indian"
              autoComplete="country-name"
              className={inputClass("nationality")}
            />
          </div>

          {getError("nationality") && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {getError("nationality")}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* PASSPORT NUMBER */}
        {/* ================================================= */}

        <div>
          <label
            htmlFor={`passenger-${index}-passportNumber`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Passport number
          </label>

          <div className="relative">
            <FileText
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id={`passenger-${index}-passportNumber`}
              name={`passenger-${index}-passportNumber`}
              type="text"
              value={value.passportNumber}
              onChange={(event) =>
                onChange(
                  "passportNumber",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="Passport number"
              autoComplete="off"
              maxLength={20}
              className={`${inputClass(
                "passportNumber"
              )} uppercase`}
            />
          </div>

          {getError("passportNumber") && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {getError("passportNumber")}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* EMAIL */}
        {/* ================================================= */}

        <div>
          <label
            htmlFor={`passenger-${index}-email`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id={`passenger-${index}-email`}
              name={`passenger-${index}-email`}
              type="email"
              value={value.email}
              onChange={(event) =>
                onChange("email", event.target.value)
              }
              placeholder="passenger@example.com"
              autoComplete="email"
              className={inputClass("email")}
            />
          </div>

          {getError("email") && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {getError("email")}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* CONTACT NUMBER */}
        {/* ================================================= */}

        <div>
          <label
            htmlFor={`passenger-${index}-contactNumber`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Contact number
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id={`passenger-${index}-contactNumber`}
              name={`passenger-${index}-contactNumber`}
              type="tel"
              value={value.contactNumber}
              onChange={(event) =>
                onChange(
                  "contactNumber",
                  event.target.value
                )
              }
              placeholder="+91 9876543210"
              autoComplete="tel"
              className={inputClass("contactNumber")}
            />
          </div>

          {getError("contactNumber") && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {getError("contactNumber")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}