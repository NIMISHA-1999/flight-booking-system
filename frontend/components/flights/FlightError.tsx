interface Props {
  message: string;
}

export default function FlightError({
  message,
}: Props) {
  return (
    <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
      {message}
    </div>
  );
}