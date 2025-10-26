// server.js

// 1. Import
const express = require('express');
const path = require('path');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 2. Inisialisasi & Konfigurasi
const app = express();
const PORT = process.env.PORT || 3000;

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SERPAPI_KEY || !OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("FATAL ERROR: One or more environment variables are not defined.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SOCIAL_MEDIA_DOMAINS = ['twitter.com', 'facebook.com', 'instagram.com', 'tiktok.com', 'linkedin.com', 'reddit.com'];


// ===============================================================
// --- SOLUSI: Tambahkan Mekanisme Cache Sederhana ---
const requestCache = new Map();
const CACHE_DURATION_MS = 86400 * 1000; // Cache berlaku selama 30 detik
// ===============================================================

// 3. Middleware
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());

// 4. API Endpoint Utama (Dengan Logika Cache)
app.get('/api/analyze', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

    const normalizedKeyword = keyword.toLowerCase().trim();

    // --- PERIKSA CACHE ---
    const cachedEntry = requestCache.get(normalizedKeyword);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS) {
        console.log(`[Cache] HIT: Serving cached data for "${normalizedKeyword}".`);
        // Kirim data dari cache dan jangan lakukan analisis baru
        return res.json(cachedEntry.data);
    }
    console.log(`[Cache] MISS: No valid cache for "${normalizedKeyword}". Performing new analysis.`);
    // -------------------

    try {
        const [socialResults, newsResults] = await Promise.all([searchSocialMedia(normalizedKeyword), searchNews(normalizedKeyword)]);
        
        console.log(`[Backend] Social Media search found ~${socialResults.total_results.toLocaleString()} results.`);
        console.log(`[Backend] News search found ~${newsResults.total_results.toLocaleString()} results.`);
        
        const allResults = [...socialResults.results, ...newsResults.results];
        const totalResultCount = socialResults.total_results + newsResults.total_results;
        allResults.sort(() => Math.random() - 0.5);
        //allResults =  shuffleArray(allResults);

        const data = await processDataWithAI(normalizedKeyword, allResults, totalResultCount);
        
        // --- SIMPAN HASIL KE CACHE ---
        requestCache.set(normalizedKeyword, {
            data: data,
            timestamp: Date.now()
        });
        // Bersihkan cache lama secara berkala untuk mencegah memory leak
        clearOldCache();
        // -------------------------

        res.json(data);

    } catch (error) {
        console.error('[Backend] Error:', error);
        res.status(500).json({ error: 'Failed to complete analysis. ' + error.message });
    }
});



// 5. Menjalankan Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));



// --- Fungsi untuk membersihkan cache lama ---
function clearOldCache() {
    const now = Date.now();
    for (const [key, entry] of requestCache.entries()) {
        if (now - entry.timestamp > CACHE_DURATION_MS) {
            requestCache.delete(key);
            console.log(`[Cache] Cleared expired cache for "${key}".`);
        }
    }
}

// ... (Sisa dari kode server.js Anda tetap sama persis)
// ... (Fungsi searchSocialMedia, searchNews, makeSerpApiRequest, getSentimentFromAI, getAiRecommendations, processDataWithAI, getSourceIcon, randomColor)
async function searchSocialMedia(query) {
    const sitesQuery = SOCIAL_MEDIA_DOMAINS.map(domain => `site:${domain}`).join(' OR ');
    const finalQuery = `"${query}" (${sitesQuery})`;
    const params = { api_key: SERPAPI_KEY, engine: "google", q: finalQuery, tbs: "qdr:w" };
    const json = await makeSerpApiRequest(params);
    return { results: json.organic_results || [], total_results: json.search_information?.total_results || 0 };
}
async function searchNews(query) {
    const params = { api_key: SERPAPI_KEY, engine: "google_news", q: query, tbs: "qdr:w", gl: "id", hl: "id" };
    const json = await makeSerpApiRequest(params);
    const normalizedResults = (json.news_results ||  []).map(item => ({ ...item, snippet: item.snippet || item.title }));
    return { results: normalizedResults, total_results: json.search_information?.total_results || 0 };
}
async function makeSerpApiRequest(params) {
    const searchUrl = new URL("https://serpapi.com/search.json");
    Object.keys(params).forEach(key => searchUrl.searchParams.set(key, params[key]));
    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error(`SerpApi request failed with status ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(`SerpApi Error: ${json.error}`);
    return json;
}
async function getSentimentFromAI(text) {
    if (!text || text.trim() === '') return 'Neutral';
    try {
        const completion = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{"role": "system", "content": "You are a sentiment analysis expert. Analyze the text and respond with only one word: Positive, Negative, or Neutral."}, {"role": "user", "content": text}], temperature: 0, max_tokens: 5, });
        let sentiment = completion.choices[0].message.content.trim();
        return ['Positive', 'Negative', 'Neutral'].includes(sentiment) ? sentiment : 'Neutral';
    } catch (error) { console.error("OpenAI Sentiment Error:", error.message); return 'Neutral'; }
}
async function getAiRecommendations(snippets, keyword, sentimentData) {
    if (!snippets || snippets.length === 0) return "No data to generate recommendations.";
    const combinedText = snippets.join("\n\n---\n\n");
    const sentimentContext = `Current sentiment: ${sentimentData.pos}% Positive, ${sentimentData.neg}% Negative.`;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are a PR consultant. Based on snippets and sentiment for a brand, give 3 actionable recommendations to improve its positive image. Format as a numbered list (e.g., '1. ...'). Each recommendation should be a concise sentence."},
                {"role": "user", "content": `Brand: "${keyword}"\nSentiment: ${sentimentContext}\n\nSnippets:\n${combinedText}`}
            ],
            temperature: 0.6, max_tokens: 10,
        });
        return completion.choices[0].message.content.trim();
    } catch (error) { console.error("OpenAI Recommendation Error:", error.message); return "Could not generate AI recommendations."; }
}
async function processDataWithAI(keyword, searchResults, totalResultCount) {
    let sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const topSources = new Map();
    const resultsToAnalyze = searchResults.slice(0, 5);

    const mentions = await Promise.all(resultsToAnalyze.map(async (result) => {
        const snippet = result.snippet || `Title: ${result.title}`;
        const sentiment = await getSentimentFromAI(snippet);
        sentimentCounts[sentiment]++;
        let domain = 'unknown.com';
        try { domain = new URL(result.link).hostname.replace('www.', ''); topSources.set(domain, (topSources.get(domain) || 0) + 1); } catch (e) {}
        return { icon: getSourceIcon(domain), title: result.title, link: result.link, displayLink: result.displayed_link || domain, snippet: snippet.replace(new RegExp(keyword, 'gi'), `<mark>${keyword}</mark>`), sentiment: sentiment };
    }));
    
    const liveMentions = totalResultCount;
    
    // --- INTEGRASI SUPABASE DENGAN VALIDASI TANGGAL ---

    // 1. Ambil entri TERAKHIR untuk keyword ini
    console.log(`[Supabase] Checking last entry for "${keyword}".`);
    const { data: lastEntry, error: lastEntryError } = await supabase
        .from('analysis_history')
        .select('created_at')
        .eq('keyword', keyword.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .single(); // .single() untuk mendapatkan satu objek, bukan array

    if (lastEntryError && lastEntryError.code !== 'PGRST116') {
        // Abaikan error 'PGRST116' (no rows found), tapi log error lainnya
        console.error('[Supabase] Error fetching last entry:', lastEntryError.message);
    }

    // 2. Periksa apakah perlu menyimpan entri baru
    let shouldInsert = true;
    if (lastEntry) {
        const lastDate = new Date(lastEntry.created_at).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        if (lastDate === today) {
            shouldInsert = false;
            console.log(`[Supabase] Skipping insert. Keyword "${keyword}" already analyzed today.`);
        }
    }

    // 3. Simpan data baru HANYA jika diperlukan
    if (shouldInsert) {
        console.log(`[Supabase] Saving new entry for "${keyword}" with ${liveMentions} mentions.`);
        const { error: insertError } = await supabase
            .from('analysis_history')
            .insert({ keyword: keyword.toLowerCase(), mention_count: liveMentions,negative_count: sentimentCounts.Negative,positive_count: sentimentCounts.Positive,neutral_count: sentimentCounts.Neutral,analysis_data:searchResults });

        if (insertError) {
            console.error('[Supabase] Error inserting data:', insertError.message);
        }
    }

    // 4. Ambil 40 data historis terakhir untuk keyword ini (logika ini tetap sama)
    console.log(`[Supabase] Fetching history for "${keyword}".`);
    const { data: history, error: fetchError } = await supabase
        .from('analysis_history')
        .select('mention_count,negative_count,positive_count,neutral_count,analysis_data')
        .eq('keyword', keyword.toLowerCase())
        .order('created_at', { ascending: false }).limit(40);

    if (fetchError) {
        console.error('[Supabase] Error fetching history:', fetchError.message);
    }
    
    let previousMentionsChange = 0;
    if (history && history.length > 1) {
        const previousMentions = history[1].mention_count;
        if (previousMentions > 0) {
            previousMentionsChange = Math.round(((liveMentions - previousMentions) / previousMentions) * 100);
        } else if (liveMentions > 0) {
            previousMentionsChange = 100;
        }
    }

    let previousnegativeeChange = 0;
    if (history && history.length > 1) {
        const previousMentions = history[1].negative_count;
        if (previousnegativeeChange > 0) {
            previousnegativeeChange = Math.round(((sentimentCounts.Negative - previousMentions) / previousMentions) * 100);
        } else if (liveMentions > 0) {
            previousnegativeeChange = 100;
        }
    }

    let previousPositiveChange = 0;
    if (history && history.length > 1) {
        const previousMentions = history[1].positive_count;
        if (previousPositiveChange > 0) {
            previousMentionsChange = Math.round(((sentimentCounts.Positive - previousMentions) / previousMentions) * 100);
        } else if (liveMentions > 0) {
            previousPositiveChange = 100;
        }
    }

    

    let trendData = [];
    if (history && history.length > 0) { trendData = history.map(row => row.mention_count).reverse(); }
    const normalizedTrend = Array(40).fill(0);
    const startIndex = Math.max(0, 40 - trendData.length);
    trendData.forEach((val, i) => { normalizedTrend[startIndex + i] = val; });
    const maxMentions = Math.max(...normalizedTrend, 1);
    const scaledTrend = normalizedTrend.map(val => Math.min(95, Math.max(5, (val / maxMentions) * 90)));
 

    let sentimentPercentages = { pos: 0, neu: 0, neg: 0 };
    if (mentions && mentions.length > 0) {
        sentimentPercentages.pos = Math.floor(((sentimentCounts.Positive + history[0].positive_count)/searchResults.length) * 100);       
        sentimentPercentages.neg = Math.floor(((sentimentCounts.Negative + history[0].negative_count)/searchResults.length) * 100);
        sentimentPercentages.neu = 100 -  sentimentPercentages.pos - sentimentPercentages.neg ;
    }

    //const aiRecommendations = await getAiRecommendations(resultsToAnalyze.map(r => r.snippet), keyword, sentimentPercentages);
    const aiRecommendations = "Nothing to do!"
    const sortedSources = Array.from(topSources.entries()).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
   
    const topAnalytics = { mentions: searchResults.length, sentiment: sentimentPercentages, topSources: sortedSources.slice(0, 3), trend: scaledTrend };
    const overview = {
        stats: [
            { label: 'Live Mentions (7 days)', value: liveMentions, change: previousMentionsChange },
            { label: 'Positive mention (24 hours)', value: (sentimentCounts.Positive + history[0].positive_count), change: previousPositiveChange},
            { label: 'Negative mentions (24 hours)', value: (sentimentCounts.Negative + history[0].negative_count), change: previousnegativeeChange },
            { label: 'Estimated Reach', value: liveMentions * (Math.floor(Math.random() * (200 - 50 + 1)) + 50), change: Math.floor(Math.random() * (200 - 20 + 1)) + 20},
            { label: 'Unique Sources (Top 5)', value: topSources.size, change: Math.floor(Math.random() * (15 - -5 + 1)) + -5},
            { label: 'AI Sentiment Score', value: Math.max(0, sentimentPercentages.pos - sentimentPercentages.neg), change: Math.floor(Math.random() * (15 - -15 + 1)) + -15, suffix: '/100' },
        ],
        ai_recommendations: aiRecommendations
    };

    return { topAnalytics, mentions, overview };
}

function getSourceIcon(domain){const d=domain.toLowerCase(),k={'youtube.com':'<svg class="source-icon" viewBox="0 0 28 20"><path fill="#FF0000" d="M27.5 5.6s-.3-2.1-1.2-3C25.2 1.5 24 1.5 24 1.5H4s0 0-1.2.1C1.7 2.5.5 4.5.5 5.6S.5 9 .5 9v2s0 3.4.3 4.5c.9 1.1 2.1 1.1 3.2 1.2 1.2.1 20 0 20 0s2.8 0 3.8-1.2c.9-1.1.3-4.5.3-4.5V9s0-3.4-.3-3.4z"/><path fill="#FFFFFF" d="M11.5 14V6l8 4-8 4z"/></svg>', 'twitter.com':'<svg class="source-icon" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.398.68-.627 1.47-.627 2.305 0 1.615.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/></svg>', 'facebook.com':'<svg class="source-icon" viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z"/></svg>', 'instagram.com':'<svg class="source-icon" viewBox="0 0 32 32"><defs><radialGradient id="ig-grad" cx=".3" cy="1.2" r="1.2"><stop offset="0" stop-color="#F7D34B"/><stop offset=".25" stop-color="#F9943B"/><stop offset=".5" stop-color="#ED3833"/><stop offset=".75" stop-color="#B73491"/><stop offset="1" stop-color="#624AA1"/></radialGradient></defs><path fill="url(#ig-grad)" d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm0 4a12 12 0 110 24 12 12 0 010-24zm0 6a6 6 0 100 12 6 6 0 000-12zm8-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>', 'reddit.com':'<svg class="source-icon" viewBox="0 0 24 24"><path fill="#FF4500" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.84 13.2c-.3-.29-.71-.45-1.12-.45-.49 0-.96.2-1.32.55-.4.37-.62.88-.62 1.42 0 .49.17.93.47 1.28.3.35.7.53 1.15.53.45 0 .85-.18 1.15-.53.3-.35.47-.79.47-1.28 0-.54-.22-1.05-.62-1.42zm-8.82-3.18c.89 0 1.62.72 1.62 1.62s-.72 1.62-1.62 1.62-1.62-.72-1.62-1.62.73-1.62 1.62-1.62zm5.78 6.07c-1.38-1.38-3.62-1.38-5 0-.2.2-.2.51 0 .71.2.2.51.2.71 0 .97-.97 2.56-.97 3.54 0 .2.2.51.2.71 0 .1.05.15.1.2.1 0 .15-.05.2-.1.2-.2.2-.51 0-.71z"/></svg>'};
    for(const s in k){if(d.includes(s))return k[s]}const i=d.charAt(0).toUpperCase();return`<img class="source-icon" src="https://placehold.co/40x40?text=${i}" alt="${i}" rel="noopener nofollow noreferrer">`}

function randomColor(){const c=['673AB7','3F51B5','2196F3','00BCD4','4CAF50','FF9800'];return c[Math.floor(Math.random()*c.length)]}




