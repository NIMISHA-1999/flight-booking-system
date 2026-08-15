export default function FlightLoading() {
  return (
    <div className="py-20 text-center">

      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      <p className="mt-4 text-slate-500">
        Loading flights...
      </p>

    </div>
  );
}