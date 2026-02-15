import ParticleCanvas from './components/ParticleCanvas';

export default function Home() {
    return (
        <>
            <ParticleCanvas />

            <div className="relative z-[2]">
                {/* PHASE 1: THE PORTAL */}
                <section className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-center opacity-0 animate-[portalFade_2.5s_cubic-bezier(0.25,0.46,0.45,0.94)_0.5s_forwards]">
                        <h1 className="text-[clamp(120px,25vw,280px)] font-thin tracking-[8px] text-transparent bg-gradient-to-br from-kore-gold via-kore-gold/70 to-kore-gold bg-clip-text mb-10 animate-[titlePulse_4s_ease-in-out_infinite]"
                            style={{ textShadow: '0 0 60px rgba(201, 168, 76, 0.3)' }}>
                            K0RE
                        </h1>
                        <p className="text-sm font-normal tracking-[3px] text-kore-silver mb-5 uppercase">
                            Advanced Intelligence. Not Artificial.
                        </p>
                        <p className="text-[32px] font-light tracking-[2px] text-kore-gold mb-16 animate-[dreamingPulse_3s_ease-in-out_infinite]">
                            Dreaming Reality™
                        </p>
                        <div className="text-2xl text-kore-gold animate-[breathing_2.5s_ease-in-out_infinite] mt-16">
                            ↓ Enter
                        </div>
                    </div>
                </section>

                {/* PHASE 2: THE PHILOSOPHY */}
                <section className="min-h-[400vh] w-full flex items-center justify-center relative px-10 py-24">
                    <div className="max-w-[1000px] w-full space-y-[200vh]">
                        <div className="text-[clamp(48px,12vw,140px)] font-extralight tracking-tight text-center leading-tight text-white opacity-0 transition-opacity duration-1000"
                            data-scroll-reveal>
                            This is not transformation.
                        </div>
                        <div className="text-[clamp(48px,12vw,140px)] font-extralight tracking-tight text-center leading-tight text-white opacity-0 transition-opacity duration-1000"
                            data-scroll-reveal>
                            This is intentionally and consciously
                        </div>
                        <div className="text-[clamp(48px,12vw,140px)] font-extralight tracking-tight text-center leading-tight text-white opacity-0 transition-opacity duration-1000"
                            data-scroll-reveal>
                            creating your <span className="text-kore-gold">Dreaming Reality™</span>
                        </div>
                    </div>
                </section>

                {/* PHASE 3: THE VENN DIAGRAM */}
                <section className="min-h-[200vh] w-full flex flex-col items-center justify-start px-10 py-24 relative">
                    <div className="text-sm font-normal tracking-[3px] text-kore-silver uppercase mb-8 opacity-0 animate-[fadeIn_1.5s_ease-out_0.5s_forwards]">
                        Where Mind, Body, and Soul Converge
                    </div>

                    <div className="relative w-full max-w-[900px] aspect-square mb-16">
                        <svg className="w-full h-full" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
                            style={{ filter: 'drop-shadow(0 0 40px rgba(201, 168, 76, 0.15))' }}>
                            <defs>
                                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <circle className="fill-none stroke-kore-gold stroke-[3] opacity-60 transition-all duration-400 hover:opacity-100 hover:stroke-[4] cursor-pointer"
                                cx="200" cy="250" r="150"
                                style={{ filter: 'drop-shadow(0 0 20px currentColor)' }} />
                            <circle className="fill-none stroke-kore-silver stroke-[3] opacity-60 transition-all duration-400 hover:opacity-100 hover:stroke-[4] cursor-pointer"
                                cx="300" cy="250" r="150"
                                style={{ filter: 'drop-shadow(0 0 20px currentColor)' }} />
                            <circle className="fill-none stroke-white stroke-[3] opacity-60 transition-all duration-400 hover:opacity-100 hover:stroke-[4] cursor-pointer"
                                cx="250" cy="150" r="150"
                                style={{ filter: 'drop-shadow(0 0 20px currentColor)' }} />
                        </svg>

                        <div className="absolute top-[15%] left-[5%] text-lg font-semibold tracking-wide text-kore-gold opacity-0 animate-[fadeIn_1.5s_ease-out_1.2s_forwards]">
                            MIND (CLTRN)
                        </div>
                        <div className="absolute top-[15%] right-[5%] text-lg font-semibold tracking-wide text-kore-silver opacity-0 animate-[fadeIn_1.5s_ease-out_1.2s_forwards]">
                            BODY (TRMIG)
                        </div>
                        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-lg font-semibold tracking-wide text-white opacity-0 animate-[fadeIn_1.5s_ease-out_1.2s_forwards]">
                            SOUL (SOT)
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0 animate-[fadeIn_2s_ease-out_1.5s_forwards]">
                            <div className="text-2xl font-semibold text-kore-gold tracking-wide"
                                style={{ textShadow: '0 0 30px rgba(201, 168, 76, 0.5)' }}>
                                DREAMING<br />REALITY™
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[800px] mt-10 p-10 bg-[#1C1C1E]/80 border border-kore-gold/20 rounded-3xl text-center backdrop-blur-md min-h-[140px] flex flex-col justify-center">
                        <div className="text-xl font-semibold mb-3 tracking-wide">Hover the circles to explore</div>
                        <div className="text-base font-light text-kore-silver leading-relaxed">
                            Each domain contains unique capabilities for your transformation
                        </div>
                    </div>
                </section>


                {/* PHASE 4: THE ENGINE */}
                <section className="min-h-[300vh] w-full px-10 py-24 relative">
                    {/* Execution */}
                    <div className="min-h-screen w-full flex flex-col items-center justify-center mb-24">
                        <h2 className="text-[clamp(48px,10vw,100px)] font-extralight tracking-tight text-center mb-8">
                            Not a Chatbot. Your <span className="text-kore-gold">COO</span>.
                        </h2>
                        <p className="text-lg font-light text-kore-silver max-w-[700px] text-center mb-20 leading-relaxed">
                            Powered by Advanced Intelligence — Not Artificial. K0RE delivers finished work built on the full context of your Dreaming Reality™.
                        </p>

                        <div className="w-full max-w-[600px] h-[400px] mb-16 flex items-center justify-center bg-gradient-radial from-kore-gold/8 to-transparent rounded-3xl border border-kore-gold/15">
                            <div className="text-center p-10">
                                <div className="flex gap-6 justify-center flex-wrap mb-8">
                                    <div className="bg-[#1C1C1E]/60 border border-kore-gold/12 rounded-xl px-6 py-4 min-w-[140px]">
                                        <div className="text-kore-gold text-2xl font-semibold mb-1">Deal Memos</div>
                                        <div className="text-xs text-kore-silver font-light">Generated in seconds</div>
                                    </div>
                                    <div className="bg-[#1C1C1E]/60 border border-kore-gold/12 rounded-xl px-6 py-4 min-w-[140px]">
                                        <div className="text-kore-gold text-2xl font-semibold mb-1">Financial Models</div>
                                        <div className="text-xs text-kore-silver font-light">Built from your data</div>
                                    </div>
                                    <div className="bg-[#1C1C1E]/60 border border-kore-gold/12 rounded-xl px-6 py-4 min-w-[140px]">
                                        <div className="text-kore-gold text-2xl font-semibold mb-1">Full Applications</div>
                                        <div className="text-xs text-kore-silver font-light">Not just answers — deliverables</div>
                                    </div>
                                </div>
                                <div className="text-sm text-kore-silver font-light tracking-wide">
                                    You ask. K0RE executes. Finished work — not suggestions.
                                </div>
                            </div>
                        </div>

                        <div className="text-base font-light text-kore-silver max-w-[600px] text-center leading-relaxed">
                            K0RE is a true execution engine. Tell it what you need — spreadsheets, PDFs, apps, analyses, presentations — and it delivers finished work products, not chat responses.
                        </div>
                    </div>

                    {/* Memory */}
                    <div className="min-h-screen w-full flex flex-col items-center justify-center mb-24">
                        <h2 className="text-[clamp(48px,10vw,100px)] font-extralight tracking-tight text-center mb-8">
                            Persistent <span className="text-kore-gold">Memory</span>
                        </h2>
                        <p className="text-lg font-light text-kore-silver max-w-[700px] text-center mb-20 leading-relaxed">
                            Unlike other AI tools, K0RE remembers everything. Your goals, patterns, finances, relationships.
                        </p>

                        <div className="w-full max-w-[600px] h-[400px] mb-16 flex items-center justify-center bg-gradient-radial from-kore-gold/10 to-transparent rounded-3xl border border-kore-gold/20">
                            <div className="text-center">
                                <div className="text-sm text-kore-silver leading-loose">
                                    Identity Core<br />↓<br />Domain State<br />↓<br />Journal<br />↓<br />History<br />↓<br />Output Vault<br />↓<br />Patterns
                                </div>
                            </div>
                        </div>

                        <div className="text-base font-light text-kore-silver max-w-[600px] text-center leading-relaxed">
                            Every interaction builds on everything before. Six layers of memory that compound over time.
                        </div>
                    </div>

                    {/* Skill Marketplace */}
                    <div className="min-h-screen w-full flex flex-col items-center justify-center">
                        <h2 className="text-[clamp(48px,10vw,100px)] font-extralight tracking-tight text-center mb-8">
                            The Skill <span className="text-kore-gold">Marketplace</span>
                        </h2>
                        <p className="text-lg font-light text-kore-silver max-w-[700px] text-center mb-20 leading-relaxed">
                            Install expert-built skill packs for any domain. Real estate, fitness, finance, creative — or build your own.
                        </p>

                        <div className="w-full max-w-[600px] h-[400px] mb-16 flex items-center justify-center gap-5 flex-wrap bg-gradient-radial from-kore-gold/10 to-transparent rounded-3xl border border-kore-gold/20 p-5">
                            <div className="bg-[#1C1C1E]/80 border border-kore-gold/20 px-5 py-3 rounded-xl text-xs font-medium">Mortgage Pack</div>
                            <div className="bg-[#1C1C1E]/80 border border-kore-gold/20 px-5 py-3 rounded-xl text-xs font-medium">Fitness Pack</div>
                            <div className="bg-[#1C1C1E]/80 border border-kore-gold/20 px-5 py-3 rounded-xl text-xs font-medium">Creative Pack</div>
                            <div className="bg-[#1C1C1E]/80 border border-kore-gold/20 px-5 py-3 rounded-xl text-xs font-medium">Finance Pack</div>
                        </div>

                        <div className="text-base font-light text-kore-silver max-w-[600px] text-center leading-relaxed">
                            Install domain skills. Chain them together. Build your own. Publish to the marketplace. 70/30 revenue share.
                        </div>
                    </div>
                </section>

                {/* PHASE 5: VOICE & RECORDING */}
                <section className="min-h-[250vh] w-full px-10 py-24 relative">
                    <h2 className="text-center text-[clamp(40px,10vw,80px)] font-extralight tracking-tight mb-16">
                        Voice-First. Always <span className="text-kore-gold">Listening</span>.
                    </h2>

                    <div className="w-full max-w-[800px] h-[200px] mx-auto mb-16 flex items-center justify-center gap-1 px-10 py-10 bg-kore-gold/5 border border-kore-gold/10 rounded-3xl">
                        {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((delay, i) => (
                            <div key={i} className="w-1 bg-kore-gold rounded-sm opacity-60 animate-[waveAnimated_1.2s_ease-in-out_infinite]"
                                style={{ animationDelay: `${delay}s`, height: '20px' }} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[900px] mx-auto">
                        {[
                            { title: 'Voice Conversations', desc: 'Talk to K0RE like a person' },
                            { title: 'Meeting Recording', desc: 'Capture every moment' },
                            { title: 'Whisper Coaching', desc: 'Real-time suggestions' },
                            { title: 'Relationship Intelligence', desc: 'Auto-CRM from conversations' },
                            { title: '100+ Languages', desc: 'Global from day one' }
                        ].map((feature, i) => (
                            <div key={i} className="text-center p-8 bg-[#1C1C1E]/50 border border-kore-gold/10 rounded-2xl opacity-0 animate-[slideIn_1s_ease-out_forwards]"
                                style={{ animationDelay: `${0.3 + i * 0.2}s` }}>
                                <div className="text-sm font-semibold text-kore-gold tracking-wide mb-2">{feature.title}</div>
                                <p className="text-sm text-kore-silver font-light">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PHASE 6: THE NETWORK */}
                <section className="min-h-[200vh] w-full px-10 py-24 flex flex-col items-center justify-center relative">
                    <h2 className="text-center text-[clamp(40px,10vw,80px)] font-extralight tracking-tight mb-16">
                        Collective <span className="text-kore-gold">Intelligence</span>
                    </h2>

                    <div className="w-full max-w-[600px] h-[300px] mb-16 relative bg-gradient-radial from-kore-gold/10 to-transparent rounded-3xl border border-kore-gold/20">
                        {[
                            { top: '20%', left: '15%', delay: '0s' },
                            { top: '40%', left: '30%', delay: '1s' },
                            { top: '50%', left: '50%', delay: '2s' },
                            { top: '35%', left: '70%', delay: '1.5s' },
                            { top: '70%', left: '45%', delay: '0.5s' },
                            { top: '60%', left: '75%', delay: '2.5s' }
                        ].map((node, i) => (
                            <div key={i} className="absolute w-3 h-3 bg-kore-gold rounded-full animate-[networkFloat_4s_ease-in-out_infinite]"
                                style={{ top: node.top, left: node.left, animationDelay: node.delay, boxShadow: '0 0 20px rgba(201, 168, 76, 0.5)' }} />
                        ))}
                    </div>

                    <div className="text-center max-w-[700px]">
                        <p className="text-base font-light text-kore-silver mb-8 leading-relaxed">
                            Every member makes K0RE smarter. Anonymized patterns. Community benchmarks. Shared wisdom.
                        </p>
                        <p className="text-base font-light text-kore-silver mb-8 leading-relaxed">
                            The Network Knowledge Library — audiobooks, courses, curated content shared across the community.
                        </p>
                        <div className="text-sm font-medium text-[#E94560] tracking-[2px] uppercase border-t-2 border-[#E94560] pt-5 mt-5">
                            The RedPaper — Part 1 — Coming Soon
                        </div>
                    </div>
                </section>

                {/* PHASE 7: THE FIRST DREAM (ONBOARDING) */}
                <section className="min-h-screen w-full flex flex-col items-center justify-center px-12 py-20 text-center">
                    <div className="text-xs tracking-[4px] text-kore-silver uppercase mb-6">Your Journey Begins</div>
                    <h2 className="text-[clamp(40px,8vw,72px)] font-extralight tracking-tight mb-6">
                        The First <span className="text-kore-gold">Dream</span>
                    </h2>
                    <p className="text-base text-[#C7C7CC] max-w-[600px] mx-auto mb-16 font-light leading-relaxed">
                        7 minutes. Voice-guided. K0RE learns who you are, what you're building, and designs your first Perfect Day. This is where your Dreaming Reality™ begins.
                    </p>

                    <div className="flex gap-6 flex-wrap justify-center max-w-[900px]">
                        {[
                            { time: '0:30', title: 'Welcome', desc: 'Choose your voice persona' },
                            { time: '2:00', title: 'The Question', desc: '"What does your dream day look like?"' },
                            { time: '3:00', title: 'Domain Scan', desc: '6 life domains assessed' },
                            { time: '1:30', title: 'Your Perfect Day', desc: 'K0RE designs it. You confirm.' }
                        ].map((step, i) => (
                            <div key={i} className="bg-[#1C1C1E] border border-kore-gold/10 rounded-2xl px-6 py-8 flex-1 min-w-[160px] max-w-[200px]">
                                <div className="text-kore-gold text-3xl font-semibold mb-2">{step.time}</div>
                                <div className="text-sm font-medium mb-1">{step.title}</div>
                                <div className="text-xs text-kore-silver font-light">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PHASE 8: SHARE THE DREAM (REFERRAL) */}
                <section className="min-h-[60vh] w-full flex flex-col items-center justify-center px-12 py-20 text-center">
                    <h2 className="text-[clamp(36px,7vw,64px)] font-extralight tracking-tight mb-6">
                        Share the <span className="text-kore-gold">Dream</span>
                    </h2>
                    <p className="text-base text-[#C7C7CC] max-w-[550px] mx-auto mb-12 font-light leading-relaxed">
                        Every member you bring into the network earns you recurring rewards. Share your K0RE Score. Grow together.
                    </p>

                    <div className="flex gap-4 flex-wrap justify-center">
                        {[
                            { rate: '8%', tier: 'Operator Earn' },
                            { rate: '18%', tier: 'Commander Earn' },
                            { rate: '28%', tier: 'Architect Earn' }
                        ].map((earn, i) => (
                            <div key={i} className="bg-[#1C1C1E] border border-kore-gold/10 rounded-xl px-7 py-6 text-center min-w-[140px]">
                                <div className="text-2xl font-semibold text-kore-gold">{earn.rate}</div>
                                <div className="text-xs text-kore-silver mt-1">{earn.tier}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-[#6B6B70] mt-6 font-light">Recurring commissions via Stripe Connect. Paid monthly.</p>
                </section>

                {/* PHASE 9: PRICING */}
                <section className="min-h-[250vh] w-full px-10 py-24 relative">
                    <div className="text-center mb-24">
                        <h2 className="text-[clamp(48px,10vw,100px)] font-extralight tracking-tight mb-5">
                            Choose Your <span className="text-kore-gold">Path</span>
                        </h2>
                        <div className="text-sm tracking-[4px] text-kore-gold mb-5">MEMBERSHIP TIERS</div>
                        <p className="text-base font-light text-kore-silver max-w-[600px] mx-auto">
                            One platform. Every model. Your Dreaming Reality™.
                        </p>
                    </div>

                    <div className="flex flex-col gap-10 max-w-[600px] mx-auto">
                        {[
                            { tier: 'Observer', name: 'Free', price: '$0', tagline: 'Begin Dreaming', desc: 'Light models, 30 interactions/day, core K0RE skills', delay: '0.2s' },
                            { tier: 'Operator', name: 'Monthly', price: '$78', tagline: 'Start Awakening', desc: 'Standard models, voice, 5hrs recording, domain packs', delay: '0.4s' },
                            { tier: 'Commander', name: 'Monthly', price: '$198', tagline: 'Create Consciously', desc: 'All models, unlimited voice, whisper coaching, marketplace', delay: '0.6s' },
                            { tier: 'Architect', name: 'Monthly', price: '$398', tagline: 'Manifest Reality', desc: 'Dedicated capacity, publish skills, white-label, team seats', delay: '0.8s' },
                            { tier: 'Enterprise', name: 'Per Seat', price: '$98', tagline: 'Collective Dreaming', desc: 'Custom everything, team intelligence, SLA', delay: '1s' }
                        ].map((plan, i) => (
                            <div key={i} className="p-10 bg-[#1C1C1E]/80 border border-kore-gold/15 rounded-3xl text-center backdrop-blur-md transition-all duration-400 cursor-pointer hover:scale-105 hover:border-kore-gold hover:bg-kore-gold/5 hover:shadow-[0_0_40px_rgba(201,168,76,0.2)] opacity-0 animate-[slideIn_1s_ease-out_forwards]"
                                style={{ animationDelay: plan.delay }}>
                                <div className="text-sm font-semibold text-kore-gold tracking-[2px] uppercase mb-3">{plan.tier}</div>
                                <div className="text-2xl font-semibold mb-4 tracking-tight">{plan.name}</div>
                                <div className="text-5xl font-extralight text-kore-gold mb-3 tracking-tight">{plan.price}</div>
                                <div className="text-sm font-normal text-kore-silver mb-8 leading-relaxed">{plan.tagline}</div>
                                <div className="text-sm font-light text-white leading-relaxed">{plan.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <div className="inline-flex items-center gap-2 px-8 py-3 border border-kore-gold/15 rounded-3xl bg-[#1C1C1E]/50">
                            <span className="text-xs text-kore-silver font-normal">Secure payments via</span>
                            <span className="text-sm text-white font-semibold tracking-wide">Stripe</span>
                            <span className="text-xs text-kore-silver">•</span>
                            <span className="text-xs text-kore-silver font-normal">14-day free trial on all paid tiers</span>
                        </div>
                    </div>
                </section>

                {/* PHASE 10: FINAL CTA */}
                <section className="min-h-[150vh] w-full flex flex-col items-center justify-center px-10 py-24 relative text-center">
                    <div className="w-[120px] h-[120px] mx-auto mb-10 text-[80px] animate-[diamondRotate_8s_linear_infinite]">💎</div>
                    <h2 className="text-[clamp(48px,10vw,90px)] font-extralight tracking-tight mb-8 max-w-[800px]">
                        Your <span className="text-kore-gold">Dreaming Reality™</span> is Waiting.
                    </h2>

                    <div className="flex gap-5 flex-wrap justify-center mb-10">
                        <button className="px-10 py-4 text-sm font-semibold tracking-wide rounded-full bg-kore-gold text-kore-black transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(201,168,76,0.4)]">
                            Take the Free Assessment
                        </button>
                        <button className="px-10 py-4 text-sm font-semibold tracking-wide rounded-full bg-transparent text-kore-gold border-2 border-kore-gold transition-all duration-400 hover:bg-kore-gold/10 hover:-translate-y-1">
                            Read the RedPaper
                        </button>
                    </div>

                    <p className="text-sm font-normal tracking-[2px] text-kore-silver uppercase mb-10">
                        Advanced Intelligence. Not Artificial.
                    </p>
                    <p className="text-xs font-light text-kore-silver tracking-wide">
                        K0RE • CLTRN • Dreaming Reality™ • 2026 | Built for K0RE-0 (Cal)
                    </p>
                </section>
            </div>
        </>
    );
}
