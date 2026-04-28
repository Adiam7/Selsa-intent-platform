'use client';
import Link from 'next/link';
import { Users, Zap, BookOpen, GraduationCap, ShoppingCart, Rocket, Lightbulb, HelpCircle, HandHeart, Heart, Lock, Zap as ZapCheck, TrendingUp, Layers, ChevronDown, ArrowRight } from 'lucide-react';

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-pink-50 to-purple-50 text-gray-900 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
      </div>
      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/[0.17] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">IntentHub</span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
                <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Posts</Link>
                <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Solutions</Link>
                <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Resources</Link>
                <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Pricing</Link>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
                  Company <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            <div className="flex items-center gap-3">
              <Link href="/signin" className="text-sm font-medium text-gray-700 hover:text-gray-900">Log in</Link>
            </div>
          </div>
        </nav>

        <main className="relative flex items-center justify-center px-6 overflow-hidden pt-8 pb-4">
          <div className="relative max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:justify-center">
            <div className="relative flex items-center justify-center  h-96 w-96 mx-auto bg-gradient-to-b from-blue-100/50 to-transparent rounded-full">
              <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_20px_60px_rgba(59,130,246,0.5)] flex items-center justify-center text-white z-20">
                <Users className="w-12 h-12" />
              </div>
              <div className="absolute w-64 h-64 rounded-full border-2 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
              <div className="absolute w-52 h-52 rounded-full border-2 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
              <div className="absolute w-96 h-96 rounded-full border-2 border-white/40" />
              <div className="absolute w-[28rem] h-[28rem] rounded-full border border-white/20" />
              <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{top: '30px', left: '50%', transform: 'translateX(-50%)'}} />
              <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{bottom: '30px', left: '50%', transform: 'translateX(-50%)'}} />
              {[
                { label: "Learn", color: "from-purple-400 to-indigo-500", x: 0, y: -200, icon: GraduationCap },
                { label: "Teach", color: "from-blue-400 to-blue-600", x: 130, y: -110, icon: BookOpen },
                { label: "Buy", color: "from-cyan-400 to-blue-500", x: 200, y: 0, icon: ShoppingCart },
                { label: "Explore Ideas", color: "from-pink-400 to-rose-500", x: 130, y: 130, icon: Lightbulb },
                { label: "Build", color: "from-yellow-400 to-orange-400", x: 0, y: 200, icon: Rocket },
                { label: "Support", color: "from-indigo-400 to-purple-500", x: -130, y: 130, icon:HandHeart},
                { label: "Collaborate", color: "from-cyan-300 to-teal-400", x: -200, y: 0, icon: Users },
                { label: "Ask", color: "from-orange-400 to-pink-400", x: -130, y: -110, icon: HelpCircle },
                // { label: "Engage", color: "from-pink-300 to-pink-500", x: -80, y: -170, icon: Heart },
              ].map((node, i) => {
                const IconComponent = node.icon;
                return (
                  <div key={i} className="absolute px-2 py-1 text-xs rounded-full bg-white/[0.17] backdrop-blur-xl shadow-xl flex items-center gap-1 hover:bg-white/25 transition-colors cursor-pointer border border-white/40" style={{position: 'absolute', left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: 'translate(-50%, -50%)', boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'}}>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg border border-white/60`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 whitespace-nowrap text-xs">{node.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center md:justify-center">
              <div className="w-full max-w-md p-10 rounded-3xl bg-white/[0.17] backdrop-blur-2xl border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
                {/* <div className="inline-block mb-4 px-3 py-1 text-xs rounded-full bg-purple-100/60 text-purple-600 font-semibold backdrop-blur-sm"> Welcome to Intent Platform</div> */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">Where every<br />intent<br /><span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">finds the right people</span></h1>
                <p className="mt-4 text-slate-600 text-base leading-relaxed">Connect intent signals with the right users, products, and actions—instantly.</p>
                <div className="mt-8 flex items-center gap-4">
                  {/* <Link href="/signup" className="px-6 h-12 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all">Get Started<ArrowRight className="w-4 h-4 inline ml-2" /></Link> */}
                  <Link href="/signup" className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all gap-2">
                Get Started
                <div className="w-6 h-6 rounded-full bg-white  flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </div>
              </Link>
                </div>
                {/* <div className="mt-6 text-xs text-slate-500 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  No credit card required
                </div> */}
              </div>
            </div>
          </div>
          <style jsx>{`@keyframes float {0% { transform: translateY(0px); }50% { transform: translateY(-10px); }100% { transform: translateY(0px); }}.animate-float { animation: float 5s ease-in-out infinite; }`}</style>
        </main>

        <section className="max-w-7xl mx-auto px-6 pt-4 pb-8">
          <div className="p-6 rounded-3xl bg-white/[0.17] backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3 lg:border-r lg:border-white/30 lg:pr-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"><Lock className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Privacy First</h3>
                  <p className="text-xs text-gray-600 mt-1">Enterprise-grade security and data protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3 lg:border-r lg:border-white/30 lg:px-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><ZapCheck className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Real-time Matching</h3>
                  <p className="text-xs text-gray-600 mt-1">Instantly connect signals to the right people</p>
                </div>
              </div>
              <div className="flex items-start gap-3 lg:border-r lg:border-white/30 lg:px-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Higher Conversions</h3>
                  <p className="text-xs text-gray-600 mt-1">AI-driven insights that drive measurable results</p>
                </div>
              </div>
              <div className="flex items-start gap-3 lg:pl-6">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0"><Layers className="w-5 h-5 text-pink-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Easy Integration</h3>
                  <p className="text-xs text-gray-600 mt-1">Works with your stack in minutes, not weeks</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-200 bg-white/[0.17] backdrop-blur-sm text-center py-8 text-xs text-gray-600">© 2026 IntentHub · Built for makers, learners & doers</footer>
      </div>
    </div>
  );
}