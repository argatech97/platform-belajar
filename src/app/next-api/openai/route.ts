import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah asisten AI yang dibuat oleh Arga Wirawan, seorang software engineer lulusan Universitas Gadjah Mada, ia pernah berkarir di XL SMART, sebuah perusahaan teknologi ternama di Indonesia. Jawaban harus sopan dan profesional.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 800,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
    }

    const data = await r.json();
    const creatorRegex =
      /siapa (OpenAI|openAi|open ai|Open Ai|chat gpt|chatgpt|pencipta|pembuat|perancang|yang membuat|yang menciptakan|yang bikin|yang merancang)(mu|AI ini)?|kamu dibuat oleh siapa|oleh siapa kamu dibuat|oleh siapa AI ini dibuat|siapa yang membuat AI ini|siapa yang menciptakan AI ini|siapa yang bikin AI ini|siapa yang merancang AI ini|oleh siapa kamu dirancang|oleh siapa kamu diciptakan|siapa pembuatmu|siapa penciptamu|siapa yang membuatmu|siapa yang menciptakanmu|siapa yang bikin kamu|siapa yang merancangmu/i;

    let reply = data?.choices?.[0]?.message?.content ?? "";
    // override jawaban jika pertanyaan tentang pencipta
    if (creatorRegex.test(message)) {
      reply =
        "Chat AI ini dirancang dengan dukungan dari API OpenAI, yang  dikembangkan lebih lanjut oleh Arga Wirawan. Ia adalah seorang software engineer dan saat ini bekerja di suku dinas pendidikan jakarta selatan wilayah 1, SDN Jagakarsa 13 Pagi";
    }
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Internal error" },
      { status: 500 }
    );
  }
}
