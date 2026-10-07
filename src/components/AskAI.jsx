import { useEffect, useRef, useState } from "react";
import { askAssistant } from "../services/ai";

const SUGGESTIONS = [
  "Who can donate blood?",
  "How do I raise a blood request?",
  "How often can I donate?",
];

function AskAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the BloodBond assistant. Ask me about donating blood, raising requests or finding stock.",
    },
  ]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const history = messages.slice(1);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const { reply } = await askAssistant(question, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err.message || "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-red-600 text-white text-2xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition flex items-center justify-center"
      >
        {open ? "×" : "AI"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[22rem] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-red-600 text-white px-4 py-3">
            <h2 className="font-semibold">BloodBond Assistant</h2>
            <p className="text-xs text-red-100">
              Blood donation help, powered by AI
            </p>
          </div>

          <div
            ref={scrollRef}
            className="h-72 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-red-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-sm text-gray-400">
                Typing…
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="px-4 pt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 hover:bg-red-100 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 p-3 border-t border-gray-200 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={1000}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-red-600 text-white text-sm px-4 py-2 rounded-full hover:bg-red-700 disabled:opacity-50 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AskAI;
