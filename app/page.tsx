export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          BriefBot
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Privacy-first OCR utility for Swiss residents
        </p>
        <p className="text-center text-gray-500">
          Decode official mail in German, French, and Italian
        </p>
      </div>
    </main>
  );
}
