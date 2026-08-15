"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  Save,
  Plane,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createFlight,
} from "@/lib/admin.api";

export default function CreateFlightPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      flightNumber: "",
      airline: "",
      origin: "",
      destination: "",
      departureAt: "",
      arrivalAt: "",
      fare: "",
      totalSeats: "",
    });

  const update =
    (
      field: keyof typeof form,
    ) =>
    (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setForm((current) => ({
        ...current,
        [field]:
          event.target.value,
      }));
    };

  const submit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createFlight({
        flightNumber:
          form.flightNumber.trim(),
        airline:
          form.airline.trim(),
        origin:
          form.origin.trim(),
        destination:
          form.destination.trim(),
        departureAt:
          new Date(
            form.departureAt,
          ).toISOString(),
        arrivalAt:
          new Date(
            form.arrivalAt,
          ).toISOString(),
        fare: Number(form.fare),
        totalSeats: Number(
          form.totalSeats,
        ),
        availableSeats: Number(
          form.totalSeats,
        ),
      });

      router.push(
        "/admin/flights",
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to create flight.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">

      <div className="mb-8">

        <Link
          href="/admin/flights"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Flights
        </Link>

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Plane />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Add Flight
            </h1>

            <p className="text-sm text-slate-500">
              Create a new flight and inventory.
            </p>

          </div>

        </div>

      </div>

      <form
        onSubmit={submit}
        className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Flight Number"
            value={form.flightNumber}
            onChange={update(
              "flightNumber",
            )}
            placeholder="AI101"
            required
          />

          <Input
            label="Airline"
            value={form.airline}
            onChange={update(
              "airline",
            )}
            placeholder="Air India"
            required
          />

          <Input
            label="Origin"
            value={form.origin}
            onChange={update(
              "origin",
            )}
            placeholder="Chennai"
            required
          />

          <Input
            label="Destination"
            value={form.destination}
            onChange={update(
              "destination",
            )}
            placeholder="Mumbai"
            required
          />

          <Input
            label="Departure"
            type="datetime-local"
            value={form.departureAt}
            onChange={update(
              "departureAt",
            )}
            required
          />

          <Input
            label="Arrival"
            type="datetime-local"
            value={form.arrivalAt}
            onChange={update(
              "arrivalAt",
            )}
            required
          />

          <Input
            label="Fare"
            type="number"
            min="0"
            step="0.01"
            value={form.fare}
            onChange={update("fare")}
            placeholder="6500"
            required
          />

          <Input
            label="Total Seats"
            type="number"
            min="1"
            value={form.totalSeats}
            onChange={update(
              "totalSeats",
            )}
            placeholder="180"
            required
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <Link
            href="/admin/flights"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
          >
            <Save size={17} />

            {loading
              ? "Creating..."
              : "Create Flight"}
          </button>

        </div>

      </form>

    </div>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />

    </div>
  );
}