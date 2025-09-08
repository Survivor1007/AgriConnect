import { useState } from "react";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ask-ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer("Error: " + (data.error || "Failed to get answer"));
      }
    } catch (err: any) {
      setAnswer("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Ask AgriConnect AI</h1>
      <form onSubmit={handleAsk} className="flex flex-col gap-4">
        <textarea
          className="w-full p-3 border rounded-md focus:ring focus:ring-green-300"
          placeholder="Ask about farming, government schemes, weather, or technology..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h2 className="font-semibold mb-2">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AskAI;
