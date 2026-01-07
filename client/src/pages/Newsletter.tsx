import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [expandedArticle1, setExpandedArticle1] = useState(false);
  const [expandedArticle2, setExpandedArticle2] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-12 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Market Insights
            </h1>
            <p className="text-gray-400">
              In-depth market analysis, articles, and videos
            </p>
          </div>

          {/* SUBSCRIBE */}
          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-2 rounded-lg transition-all duration-200"
            >
              Subscribe
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        {subscribed && (
          <div className="mb-6 p-3 bg-green-900/30 border border-green-800 rounded-lg">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Subscription successful! Welcome to AIFinverse Insights.
            </p>
          </div>
        )}

        {/* NEW ARTICLE: YEAR IN REVIEW - PLACED FIRST */}
        <section className="mb-16">
          <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm">
            {/* META */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 flex-wrap border-b border-slate-700/50 pb-4">
              <span className="flex items-center gap-1.5">
                <span className="text-lg">📅</span>
                <span>31 Dec 2025</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg">⏱</span>
                <span>8 min read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg">✍️</span>
                <span className="text-cyan-300">Year-End Analysis</span>
              </span>
              <span className="ml-auto flex items-center gap-2">
                <span className="text-slate-500"></span>
                {/* Small Share Button - Upper Right Corner */}
                <button
                  onClick={() => setShowShare(!showShare)}
                  className="relative px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:text-cyan-300 text-xs transition-all duration-200 flex items-center gap-1"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </span>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">

              {/* CONTENT */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 bg-amber-900/30 text-amber-300 rounded-full text-xs font-medium mb-3 border border-amber-800/50">
                    Year in Review
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Year in Review - The Good, The Bad, The Ugly
                  </h3>
                  <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                    I started the year on a wheelchair and it took a while to get going again, 4.5 months to get back to cricket and ironically at the same ground where "tragedy" struck. The markets had their wheelchair moment in April when Trump threw them under the "tariff" bus.
                  </p>
                </div>

                {expandedArticle1 && (
                  <div className="mt-8 text-gray-300 text-base leading-relaxed space-y-8">
                    
                    {/* FULL ARTICLE CONTENT */}
                    <div className="space-y-4">
                      <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                        As I keep growing, I realize markets are nothing but a reflection of us - our emotions, our fear, our greed and therefore, has very similar events to our life - jubilation (bull run), heart breaks (bear market), flash crash (accident) and then recovery (coz humans are built to do that!)
                      </p>
                      
                      <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                        I bounced back a few weeks post my comeback on the cricket ground and so did the markets. Here's proof of a catch that brought me back from the bottom ;)
                      </p>
                    </div>

                    {/* Video with hover effect */}
                    <div className="my-8 flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-400 ml-2">The Comeback Catch</span>
                      </div>
                      <div 
                        className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
                          hoveredVideo ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
                        }`}
                        onMouseEnter={() => setHoveredVideo(true)}
                        onMouseLeave={() => setHoveredVideo(false)}
                      >
                        <video
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full"
                          poster="/images/year-review-thumbnail.jpg"
                        >
                          <source src="/videos/year_in_review.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {hoveredVideo && (
                          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        And then there was no looking back... well for most markets - US, China, Europe, South Korea, Japan, Taiwan and many others. India and crypto decided to sit out this year - India on rich valuations and lack of direct AI plays & relentless FII selling and crypto - oh boy, that could take long - but here's the TLDR - <strong>$Trump $Melanie Tariffs Oct 10</strong>
                      </p>
                    </div>

                  {/* First Image with hover effect */}
<div className="my-8 flex flex-col items-center">
  <div 
    className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
      hoveredImage === 'year1' ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
    }`}
    onMouseEnter={() => setHoveredImage('year1')}
    onMouseLeave={() => setHoveredImage(null)}
  >
    <img
      src="/images/Picture1.png"  // or your actual image path
      alt="Market analysis chart 1"
      className="w-full rounded-lg"
    />
    {hoveredImage === 'year1' && (
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
    )}
  </div>
  <p className="text-xs text-gray-400 mt-3 text-center italic">
    
  </p>
</div>

{/* Second Image with hover effect */}
<div className="my-8 flex flex-col items-center">
  <div 
    className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
      hoveredImage === 'year2' ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
    }`}
    onMouseEnter={() => setHoveredImage('year2')}
    onMouseLeave={() => setHoveredImage(null)}
  >
    <img
      src="/images/Picture2.png"  // or your actual image path
      alt="Market analysis chart 2"
      className="w-full rounded-lg"
    />
    {hoveredImage === 'year2' && (
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
    )}
  </div>
  <p className="text-xs text-gray-400 mt-3 text-center italic">
    
  </p>
</div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold text-lg">Let's dive in deeper</h4>
                      <p className="leading-relaxed">
                        US markets and precious metals celebrated rate cuts, and prospects of rate cuts like no other. Every bad economic news has been celebrated and taken precious metals to new highs, while stocks have slowed down pace to see if indeed OpenAI is gonna crash land the AI story (I believe that's a real risk going into 2026), among others such as US / Venezuela & China / Taiwan.
                      </p>
                      
                      <p className="leading-relaxed">
                        This year has been one for the ages - Stocks and gold/silver rallying together and precious metals outperforming by miles. You could literally buy Silver, Palladium, Platinum or even Gold and laugh at your friends / colleagues trying to find the next multibagger stock or crypto. This also is a stark warning. If risk on risk off assets went up together, they might come down together too. At the time of writing, the precious metals are witnessing sharp reversal from 6 weeks of relentless gains, but still mind blowing returns for the year.
                      </p>
                    </div>
{/* Third Image */}
<div className="my-8 flex flex-col items-center">
  <div 
    className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
      hoveredImage === 'year3' ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
    }`}
    onMouseEnter={() => setHoveredImage('year3')}
    onMouseLeave={() => setHoveredImage(null)}
  >
    <img
      src="/images/Picture3.png"
      alt="AI stocks performance"
      className="w-full rounded-lg"
    />
    {hoveredImage === 'year3' && (
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
    )}
  </div>
  <p className="text-xs text-gray-400 mt-3 text-center italic">
    
  </p>
</div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        As Gemini kept making progress, GOOGL kept making new highs taking its ecosystem players with it- Broadcom in particular (till the recent post earnings correction) leading to a divergence in the OpenAI family - Nvidia, AMD, with Oracle and Coreweave being the worst hit.
                      </p>
                    </div>


                   {/* Fourth Image */}
<div className="my-8 flex flex-col items-center">
  <div 
    className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
      hoveredImage === 'year4' ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
    }`}
    onMouseEnter={() => setHoveredImage('year4')}
    onMouseLeave={() => setHoveredImage(null)}
  >
    <img
      src="/images/Picture4.png"
      alt="AI ecosystem performance"
      className="w-full rounded-lg"
    />
    {hoveredImage === 'year4' && (
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
    )}
  </div>
  <p className="text-xs text-gray-400 mt-3 text-center italic">
    
  </p>
</div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        But some AI infra stocks continued to break records - memory and storage players - Micron and WD for example.
                      </p>
                    </div>

                    {/* Fifth Image */}
<div className="my-8 flex flex-col items-center">
  <div 
    className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
      hoveredImage === 'year5' ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
    }`}
    onMouseEnter={() => setHoveredImage('year5')}
    onMouseLeave={() => setHoveredImage(null)}
  >
    <img
      src="/images/Picture5.png"
      alt="Memory and storage stocks"
      className="w-full rounded-lg"
    />
    {hoveredImage === 'year5' && (
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
    )}
  </div>
  <p className="text-xs text-gray-400 mt-3 text-center italic">
    
  </p>
</div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        I would really love a big correction in GOOGL so I can get my hands on it again.
                      </p>
                      
                      <h4 className="text-white font-semibold text-lg">Risks and Opportunities for 2026</h4>
                      <p className="leading-relaxed">
                        US market cap to GDP 230%, $70T (don't have the exact figures at the moment). A 20% correction is enough to put the fear of God into anyone. Imagine $14T wipeout, for context, crypto or what's left of it is about $3T. Where would crypto go if that were to happen?
                      </p>
                      
                      <p className="leading-relaxed">
                        I am not seeing much O's at the moment but a lot of R's. But as a trader, those R's materializing would bring O's. So let's talk about some of the Risks:
                      </p>
                      
                      <p className="leading-relaxed">
                        What could make it happen though -
                      </p>
                      
                      <ol className="space-y-3 list-decimal list-inside text-gray-300">
                        <li>Technicals are not favoring further continuation move in SP500 / Nasdaq, without a correction or a consolidation.</li>
                        <li>Majority of US population is not doing well, with the cost of living not receding and job growth slowing down. Other than AI capex, big asset owners are the one driving the economy. A correction in markets could dampen their consumption as well.</li>
                        <li>China / Taiwan. The risk is always lurking. There's no lack of will on China's part. This could be black swan no. 1</li>
                        <li>The Bond Yields - JP10Y, US10Y, 30Y... While US Fed is cutting rates, Bond yields are going higher.</li>
                        <li>If I were to pick another possible black swan - I'd go with - OpenAI and the circular AI economy (Ask oracle going up 40% in a day and then coming down 50%). How will OpenAI pay the $1.5 trillion that it has committed in deals? Gemini's growth accentuates the risk.</li>
                      </ol>
                      
                      <p className="leading-relaxed">
                        We'll see how it goes. But be certain, any risks lead to opportunities. So look forward to it. Happy New Year. Happy Trading.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedArticle1(!expandedArticle1)}
                  className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-amber-400 font-medium transition-all duration-200 flex items-center gap-2 group"
                >
                  {expandedArticle1 ? (
                    <>
                      <span>Read Less</span>
                      <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
                    </>
                  ) : (
                    <>
                      <span>Read Full Article</span>
                      <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                    </>
                  )}
                </button>
              </div>

              {/* SHARE OPTIONS SIDEBAR - Appears when share button clicked */}
              {showShare && (
                <div className="lg:w-48">
                  <div className="sticky top-24">
                    <div className="bg-slate-800/80 border border-slate-700/40 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                        <Share2 size={14} />
                        Share Options
                      </h4>
                      
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent("Check out this Year in Review analysis")}`}
                          className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-800/30 rounded-lg text-emerald-300 hover:text-emerald-200 text-xs transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">💬</span>
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800/30 rounded-lg text-blue-300 hover:text-blue-200 text-xs transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">💼</span>
                          <span>LinkedIn</span>
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this Year in Review market analysis")}`}
                          className="flex items-center gap-2 px-3 py-2 bg-sky-900/20 hover:bg-sky-900/30 border border-sky-800/30 rounded-lg text-sky-300 hover:text-sky-200 text-xs transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">📱</span>
                          <span>Telegram</span>
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setShowShare(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/30 hover:bg-slate-600/30 border border-slate-600/30 rounded-lg text-gray-300 hover:text-white text-xs transition-all duration-200"
                        >
                          <span className="text-sm">🔗</span>
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* OLD ARTICLE: ALTSEASON - PLACED BELOW */}
        <section className="mb-16">
          <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm">
            {/* META */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 flex-wrap border-b border-slate-700/50 pb-4">
              <span className="flex items-center gap-1.5">
                <span className="text-lg">📅</span>
                <span>18 Dec 2025</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg">⏱</span>
                <span>5 min read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg">✍️</span>
                <span className="text-cyan-300">AIFinverse Research</span>
              </span>
              <span className="ml-auto flex items-center gap-2">
                <span className="text-slate-500"></span>
                {/* Small Share Button - Upper Right Corner */}
                <button
                  onClick={() => setShowShare(!showShare)}
                  className="relative px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:text-cyan-300 text-xs transition-all duration-200 flex items-center gap-1"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </span>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">

              {/* CONTENT */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-xs font-medium mb-3 border border-cyan-800/50">
                    Featured Analysis
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    2025: Altseason Was Here — Just Not in Crypto
                  </h3>
                  <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                    My God, who would have thought that with US stock markets, precious metals ending the year virtually at a record high,crypto would be underperforming by a mile.After all, it was supposed to be Beta square or cube or octa. Calling it underperforming is being generous, when everything is deep deep red if you compare the prices to January eyes before $Trump and $Melania launched and kinda rugged alts and then added to the misery in April with the unleashing of tariff war and then literally nuked crypto on Oct 10, whoever is to be blamed for it. Most coins are down between 30-99.99%.
                  </p>
                </div>

                {expandedArticle2 && (
                  <div className="mt-8 text-gray-300 text-base leading-relaxed space-y-8">
                    
                    {/* FULL ARTICLE CONTENT */}
                    <div className="space-y-4">
                      <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                        <strong className="text-gray-300"></strong> 
                      </p>
                    </div>

                    {/* Video with hover effect */}
                    <div className="my-8 flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-400 ml-2">Gold–Silver–Crypto Meme</span>
                      </div>
                      <div 
                        className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
                          hoveredVideo ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
                        }`}
                        onMouseEnter={() => setHoveredVideo(true)}
                        onMouseLeave={() => setHoveredVideo(false)}
                      >
                        <video
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full"
                          poster="/images/video-thumbnail.jpg"
                        >
                          <source src="/videos/gold-silver-crypto-meme.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {hoveredVideo && (
                          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                        )}
                      </div>
                    </div>

                    {/* First Image with hover effect */}
                    <div className="my-8 flex flex-col items-center">
                      <div 
                        className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-2/3 ${
                          hoveredImage === 'image1' ? 'scale-105 shadow-2xl shadow-cyan-500/20' : 'scale-100'
                        }`}
                        onMouseEnter={() => setHoveredImage('image1')}
                        onMouseLeave={() => setHoveredImage(null)}
                      >
                        <img
                          src="/images/image_1.png"
                          alt="Chart showing crypto vs other assets"
                          className="w-full rounded-lg"
                        />
                        {hoveredImage === 'image1' && (
                          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-3 text-center italic">
                        Chart: Performance comparison
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        <strong className="text-gray-300">Santa seemed to have bailed out on crypto too.</strong> If this feels like crypto winter, hang on. Imagine what happens when it becomes risk off ergo stock market actually corrects 10-15-20%, which I see happening in 2026, possibly because of OpenAI.
                      </p>

                      <div className="bg-slate-900/50 border-l-4 border-cyan-500 pl-4 py-3 rounded-r">
                        <p className="leading-relaxed italic">
                          I had written an article months ago, but, there was hope deep inside that if stocks rally, so would crypto,{" "}
                          <a
                            href="https://www.linkedin.com/pulse/dude-wheres-my-alt-season-mohneesh-suri-v7aof/?trackingId=c0IQeFd5RFizmg2dPnyN5g%3D%3D"
                            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 decoration-2 hover:decoration-cyan-400 transition-all duration-200 font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            "Dude, where's my altseason?"
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        <strong className="text-gray-300">Anyways, credit where its due, the altseason that did happen - in stocks, in commodity.</strong> I am gonna try doing something different and call the asset leads adjacent to their crypto counterparts. Nvidia as Bitcoin, Alphabet as ETH and so on.. Gold as Bitcoin, Silver as ETH and so on and lets see how they performed this year, also adding a comparison from April lows to present.
                      </p>
                    </div>

                    {/* Performance Analysis Section */}
                    <div className="my-8">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-green-400">📊</span>
                        Performance Analysis
                      </h4>
                      
                      {/* Paired Images Side by Side */}
                      <div className="space-y-8">
                        {/* Row 1: image11 (small, left) - image_2 (big, right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left - Small image */}
                          <div className="flex items-center justify-center lg:justify-start">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full max-w-md ${
                                hoveredImage === 'image11' ? 'scale-[1.02] shadow-xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image11')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image11.png"
                                alt="Performance table 11"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image11' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>

                          {/* Right - Big image */}
                          <div className="flex items-center justify-center lg:justify-end">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full ${
                                hoveredImage === 'image_2' ? 'scale-[1.02] shadow-2xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image_2')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image_2.png"
                                alt="Performance table 2"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image_2' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 2: image12 (small, left) - image_3 (big, right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left - Small image */}
                          <div className="flex items-center justify-center lg:justify-start">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full max-w-md ${
                                hoveredImage === 'image12' ? 'scale-[1.02] shadow-xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image12')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image12.png"
                                alt="Performance table 12"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image12' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>

                          {/* Right - Big image */}
                          <div className="flex items-center justify-center lg:justify-end">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full ${
                                hoveredImage === 'image_3' ? 'scale-[1.02] shadow-2xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image_3')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image_3.png"
                                alt="Performance table 3"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image_3' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 3: image13 (small, left) - image_4 (big, right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left - Small image */}
                          <div className="flex items-center justify-center lg:justify-start">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full max-w-md ${
                                hoveredImage === 'image13' ? 'scale-[1.02] shadow-xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image13')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image13.png"
                                alt="Performance table 13"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image13' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>

                          {/* Right - Big image */}
                          <div className="flex items-center justify-center lg:justify-end">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full ${
                                hoveredImage === 'image_4' ? 'scale-[1.02] shadow-2xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image_4')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image_4.png"
                                alt="Performance table 4"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image_4' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 4: image14 (small, left) - image15 (big, right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left - Small image */}
                          <div className="flex items-center justify-center lg:justify-start">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full max-w-md ${
                                hoveredImage === 'image14' ? 'scale-[1.02] shadow-xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image14')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image14.png"
                                alt="Performance table 14"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image14' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>

                          {/* Right - Big image */}
                          <div className="flex items-center justify-center lg:justify-end">
                            <div 
                              className={`relative overflow-hidden rounded-lg border border-slate-600 transition-all duration-300 ease-out w-full ${
                                hoveredImage === 'image15' ? 'scale-[1.02] shadow-2xl shadow-cyan-500/20' : 'scale-100'
                              }`}
                              onMouseEnter={() => setHoveredImage('image15')}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <img
                                src="/images/image15.png"
                                alt="Performance table 15"
                                className="w-full rounded-lg"
                              />
                              {hoveredImage === 'image15' && (
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        <strong className="text-gray-300">While other assets had their moments and tumbles during the year, silver and co. never really looked back after the Apr 7 lows and the way they are closing is far from comforting.</strong> Silver @ $80? Up from $50 to $80 in 5 weeks? Friday, Dec 26 move in excess of 11%? Unbelievable short squeeze is on, and the shorters continue to have a Yaooza moment. If you go by the demand for physical silver, it could keep going but if you go by the technicals, there could be a rug pull waiting. Eventually, all alts correct!
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedArticle2(!expandedArticle2)}
                  className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-cyan-400 font-medium transition-all duration-200 flex items-center gap-2 group"
                >
                  {expandedArticle2 ? (
                    <>
                      <span>Read Less</span>
                      <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
                    </>
                  ) : (
                    <>
                      <span>Read Full Article</span>
                      <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                    </>
                  )}
                </button>
              </div>

              {/* SHARE OPTIONS SIDEBAR - Appears when share button clicked */}
              {showShare && (
                <div className="lg:w-48">
                  <div className="sticky top-24">
                    <div className="bg-slate-800/80 border border-slate-700/40 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                        <Share2 size={14} />
                        Share Options
                      </h4>
                      
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent("Check out this market analysis: 2025 Altseason Analysis")}`}
                          className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-800/30 rounded-lg text-emerald-300 hover:text-emerald-200 text-xs transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">💬</span>
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800/30 rounded-lg text-blue-300 hover:text-blue-200 text-xs transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">💼</span>
                          <span>LinkedIn</span>
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this crypto market analysis")}`}
                          className="flex items-center gap-2 px-3 py-2 bg-sky-900/20 hover:bg-sky-900/30 border border-sky-800/30 rounded-lg text-sky-300 hover:text-sky-200 text-xs transition-all duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">📱</span>
                          <span>Telegram</span>
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setShowShare(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/30 hover:bg-slate-600/30 border border-slate-600/30 rounded-lg text-gray-300 hover:text-white text-xs transition-all duration-200"
                        >
                          <span className="text-sm">🔗</span>
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-60 py-2 bg-slate-800 text-center text-sm text-slate-500">
        <p>
          © 2025 copyrights reserved to AIFinverse.{" "}
          <a href="/privacy-policy" className="text-cyan-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}