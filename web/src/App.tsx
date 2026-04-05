import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FileText, CreditCard, ShieldCheck, ArrowRightLeft, Landmark, LogOut, PlusSquare, MinusSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ScreenType = 
  | 'none' | 'welcome' | 'card_insert' | 'pin_entry' | 'main_menu'
  | 'withdraw' | 'withdraw_amount' | 'deposit' | 'transfer_account'
  | 'transfer_amount' | 'balance' | 'success' | 'receipt_prompt' | 'card_eject' | 'receipt_view' | 'no_card';

interface SessionData {
  playerName: string;
  bankBalance: number;
  quickAmounts: number[];
  pinTitle?: string;
}

export default function App() {
  const isNative = typeof (window as any).GetParentResourceName !== 'undefined' || typeof (window as any).invokeNative !== 'undefined';
  const isDui = window.location.href.includes('dui=true') || !isNative;
  const [screen, setScreen] = useState<ScreenType>(isDui ? 'welcome' : 'none');
  const [session, setSession] = useState<SessionData>({ playerName: 'Client', bankBalance: 0, quickAmounts: [20, 50, 100, 200, 500] });
  const [highlighted, setHighlighted] = useState<string>('');
  const [pinDots, setPinDots] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('0');
  const [processing, setProcessing] = useState<{active: boolean, duration?: number, progress?: number}>({active: false});
  const [toast, setToast] = useState<{msg: string, type: 'error'|'success'} | null>(null);
  const [successData, setSuccessData] = useState<{msg: string, amt: number, bal: number}>({ msg: '', amt: 0, bal: 0 });
  const [receiptData, setReceiptData] = useState<any>(null);
  const [currentModel, setCurrentModel] = useState<string>('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { action, data } = event.data;
      if (!action) return;

      switch (action) {
        case 'SET_MODEL':
          setCurrentModel(data.model || '');
          break;
        case 'SET_SCREEN':
          setScreen(data.screen);
          setHighlighted('');
          if (data.screen === 'pin_entry') {
              setPinDots(0);
              setSession(s => ({...s, pinTitle: data.data?.title || "ENTER PIN CODE"}));
          } else if (data.screen === 'welcome') {
              setPinDots(0);
              setInputValue('0');
          }
          if (data.data?.balance !== undefined) setSession(s => ({...s, bankBalance: data.data.balance}));
          if (data.data?.name) setSession(s => ({...s, playerName: data.data.name}));
          if (data.data?.quickAmounts) setSession(s => ({...s, quickAmounts: data.data.quickAmounts}));
          if (data.data?.message) setSuccessData({
            msg: data.data.message, amt: data.data.amount || 0, bal: data.data.newBalance || 0
          });
          if (data.screen === 'receipt_view' && data.data) {
            setReceiptData(data.data);
          }
          break;
        case 'HIGHLIGHT_BUTTON':
          setHighlighted(data.buttonId || '');
          break;
        case 'PIN_UPDATE':
          setPinDots(data.length || 0);
          break;
        case 'AMOUNT_UPDATE':
          setInputValue(data.value || '0');
          break;
        case 'playSound':
          if (data.sound === 'dispenser') {
             const audio = new Audio('dispenser.ogg');
             audio.volume = 0.5;
             audio.play().catch(e => console.error("Audio block:", e));
          }
          break;
        case 'SET_PROCESSING':
          setProcessing({ active: !!data.processing, duration: data.duration, progress: 0 });
          break;
        case 'UPDATE_PROGRESS':
          setProcessing(p => ({ ...p, progress: data.progress }));
          break;
        case 'NOTIFICATION':
          setToast({ msg: data.message, type: data.type || 'error' });
          setTimeout(() => setToast(null), 3000);
          break;
        case 'INIT_SESSION':
          setSession({
            playerName: data.data?.playerName || 'Client',
            bankBalance: data.data?.bankBalance || 0,
            quickAmounts: data.data?.quickAmounts || [20, 50, 100, 200, 500]
          });
          break;
      }
    };
    
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
         fetch(`https://${(window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'osm-atmdui'}/closeReceipt`, { method: 'POST' }).then(() => {
            setScreen('welcome');
         }).catch();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('keydown', handleKeydown);
    return () => {
       window.removeEventListener('message', handleMessage);
       window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    if (!isNative) {
      setTimeout(() => {
        window.postMessage({ action: 'INIT_SESSION', data: { playerName: 'Michael De Santa', bankBalance: 1211650, quickAmounts: [20, 50, 100, 200, 500] } }, '*');
      }, 100);
    }
  }, [isNative]);

  const pageVariants = {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3, ease: 'easeIn' } }
  };

  const formatMoney = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const isHL = (id: string) => highlighted === id;

  const SideBtn = ({ id, label, icon: Icon, right, accent, indexObj, position }: any) => {
    const hl = isHL(id);
    return (
      <div 
        className={cn(
            "flex items-center w-[95%] h-[8.5vh]",
            right ? "ml-auto justify-end" : "mr-auto justify-start",
            // position determines row placement: 1, 2, 3, or 4
            position === 1 && "row-start-1",
            position === 2 && "row-start-2",
            position === 3 && "row-start-3",
            position === 4 && "row-start-4",
        )}
      >
        <div className={cn(
          "relative flex items-center h-full w-full px-[1.5vw] border-y-[3px] transition-all duration-300 overflow-hidden",
          right ? "flex-row-reverse border-l-[6px] border-r-0 rounded-l-2xl" : "flex-row border-r-[6px] border-l-0 rounded-r-2xl",
          hl ? (
            accent 
              ? "bg-slate-900 border-[#ef4444] text-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.3)] z-50 scale-[1.02]"
              : "bg-[#064e3b] border-brand-light text-white shadow-[0_0_25px_rgba(0,234,166,0.3)] z-50 scale-[1.02]"
          ) : (
            accent
              ? "bg-[#0f172a]/90 border-slate-700 text-slate-400 hover:text-slate-300"
              : "bg-[#0f172a]/90 border-slate-700 text-slate-300"
          ),
          right && hl && !accent && "border-[#00eaa6]",
          !right && hl && !accent && "border-[#00eaa6]"
        )}>
          {hl && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none mix-blend-overlay w-[200%] animate-[scan_2s_linear_infinite]" />}

          <div className={cn("flex flex-1 items-center gap-[1vw] relative z-10 w-full", right ? "justify-end" : "justify-start")}>
            {Icon && <Icon size={32} strokeWidth={2} className={hl ? (accent ? "text-[#f87171]" : "text-brand-light") : "opacity-60"} />}
            <span className={cn(
                "font-display font-bold uppercase tracking-widest whitespace-nowrap",
                label.length > 8 ? "text-[2.2vh]" : "text-[2.8vh]",
                hl && "text-white"
            )}>{label}</span>
          </div>

          {indexObj && (
            <div className={cn(
              "absolute opacity-10 text-[6vh] font-black italic tracking-tighter leading-none select-none z-0",
              right ? "left-2" : "right-2"
            )}>
              {indexObj}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TopHeader = ({ title }: { title: string }) => (
    <div className="absolute top-[2%] left-[2%] right-[2%] flex justify-between items-center pb-[1vh] z-20 border-b border-brand/20">
      <div className="flex items-center gap-[1vw]">
        <div className="w-[15vh] h-[5.5vh] bg-gradient-to-br from-brand to-[#047857] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,234,166,0.4)]">
            <span className="font-display font-black text-[3vh] text-[#020617]">FLEECA</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
         <span className="font-display font-bold text-[2.5vh] tracking-[0.1em] text-cyan-400 capitalize bg-[#0f172a]/80 px-6 py-2 rounded-full border border-cyan-900/50 shadow-inner">
           {title}
         </span>
      </div>
    </div>
  );

  const isFleeca = currentModel === 'prop_fleeca_atm';

  if (!isDui) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-transparent">
        {screen === 'receipt_view' && receiptData && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 pointer-events-auto">
            <motion.div initial={{ y: '100vh', rotate: 5, opacity: 0 }} animate={{ y: 0, rotate: -2, opacity: 1 }} exit={{ y: '100vh', opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="bg-[#fcfaf5] w-[400px] shadow-2xl p-8 pb-12 rounded-sm border-l-4 border-l-gray-300 relative text-slate-800 font-mono" style={{ backgroundImage: "linear-gradient(to right, #fcfaf5 90%, #f1eadc 100%)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0,0,0,0.02)" }}>
              <div className="border-b-[2px] border-dashed border-slate-400 pb-6 mb-6 flex flex-col items-center">
                 <div className="w-16 h-16 bg-[#047857] text-[#fcfaf5] rounded-full flex items-center justify-center font-display font-black text-4xl mb-4">F</div>
                 <h1 className="font-bold text-2xl tracking-widest">FLEECA BANK</h1>
                 <p className="text-xs text-slate-500 mt-1 uppercase">Official Transaction Record</p>
              </div>
              
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                   <span className="text-slate-500 uppercase tracking-wider text-xs">Date/Time</span>
                   <span className="font-bold">{receiptData.date}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500 uppercase tracking-wider text-xs">Transaction</span>
                   <span className="font-bold uppercase bg-slate-200 px-2 py-0.5 rounded-sm">{receiptData.type}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-500 uppercase tracking-wider text-xs">Location</span>
                   <span className="font-bold">San Andreas ATM</span>
                </div>
                {receiptData.type === 'transfer' && (
                <div className="flex justify-between">
                   <span className="text-slate-500 uppercase tracking-wider text-xs">Transfer To</span>
                   <span className="font-bold">Acc #{receiptData.account}</span>
                </div>
                )}
              </div>

              <div className="border-y-[2px] border-solid border-slate-800 py-4 mb-8">
                <div className="flex justify-between items-center text-xl font-black">
                   <span>AMOUNT:</span>
                   <span>${Number(receiptData.amount || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center mb-8">
                 <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Balance After Transaction</p>
                 <p className="text-lg font-bold">***${Number(receiptData.balance || 0).toLocaleString()}***</p>
              </div>

              <div className="flex flex-col items-center text-xs opacity-70">
                 <p>Thank you for choosing Fleeca.</p>
                 <p>Customer Service: 1-800-FLEECA</p>
              </div>
              
              {/* Native escape button */}
              <button onClick={() => { fetch(`https://${(window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'osm-atmdui'}/closeReceipt`, { method: 'POST' }).then(()=>setScreen('none')).catch() }} className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded shadow-lg transition-colors">
                 Close [ESC]
              </button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <div 
        className="w-full h-full relative bg-[#020617] overflow-hidden text-[#f8fafc] select-none font-sans flex items-center justify-center"
        style={isFleeca ? {
          transformOrigin: 'top left',
          transform: 'translate(0.39vw, 50.78vh) scale(0.4921, 0.4648)'
        } : undefined}
      >
      
      {/* Background Styling */}
      <div className="absolute inset-0 bg-[#020617] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,180,140,0.06)_0%,transparent_60%)] z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_2px,transparent_2px)] bg-[size:100%_4px] pointer-events-none z-0 opacity-30" />
      
      {/* Sidebar Guides */}
      <div className="absolute top-0 bottom-0 w-[26%] left-0 bg-gradient-to-r from-[#020617] to-transparent z-0 opacity-80" />
      <div className="absolute top-0 bottom-0 w-[26%] right-0 bg-gradient-to-l from-[#020617] to-transparent z-0 opacity-80" />

      {/* Grid container mapping precisely to 4 mechanical ATM buttons per side */}
      {/* We use a grid mapped evenly between top 18% and bottom 18% of screen for correct Gabz-prop / Default-prop ATM alignment. */}
      {screen !== 'welcome' && screen !== 'card_insert' && screen !== 'card_eject' && screen !== 'success' && (
        <>
            <div className="absolute top-[1%] bottom-[1%] left-2 w-[25%] py-[2vh] grid grid-rows-4 items-center z-30 gap-[1vh]">
               {/* Left slots */}
               {screen === 'main_menu' && (
                 <>
                   <SideBtn id="side_l1" position={1} label="Withdraw" icon={MinusSquare} indexObj="1" />
                   <SideBtn id="side_l2" position={2} label="Deposit" icon={PlusSquare} indexObj="2" />
                   <SideBtn id="side_l3" position={3} label="Transfer" icon={ArrowRightLeft} indexObj="3" />
                   <SideBtn id="side_l4" position={4} label="Balance" icon={Landmark} indexObj="4" />
                 </>
               )}
               {screen === 'withdraw' && session.quickAmounts.slice(0,4).map((amt, i) => (
                 <SideBtn key={i} id={`side_l${i+1}`} position={i+1} label={`$${amt}`} indexObj={(i+1).toString()} />
               ))}
               {screen === 'receipt_prompt' && (
                 <SideBtn id="side_l1" position={1} label="Print" icon={FileText} indexObj="1" />
               )}
               {screen === 'no_card' && (
                 <SideBtn id="side_l4" position={4} label="Cancel" icon={LogOut} indexObj="ESC" accent />
               )}
            </div>
            <div className="absolute top-[1%] bottom-[1%] right-0 w-[25%] py-[2vh] grid grid-rows-4 items-center z-30 gap-[1vh]">
               {/* Right slots */}
               {screen === 'main_menu' && (
                 <SideBtn id="side_r4" position={4} label="Eject Card" icon={LogOut} indexObj="ESC" right accent />
               )}
               {screen === 'withdraw' && (
                 <>
                   <SideBtn id="side_r1" position={1} label={`$${session.quickAmounts[4]}`} indexObj="5" right />
                   <SideBtn id="side_r2" position={2} label="Custom" indexObj="XX" right />
                   <SideBtn id="side_r4" position={4} label="Return" icon={LogOut} indexObj="ESC" right accent />
                 </>
               )}
               {(screen === 'withdraw_amount' || screen === 'deposit' || screen === 'transfer_amount' || screen === 'transfer_account' || screen === 'pin_entry') && (
                 <>
                   <SideBtn id="side_r3" position={3} label={screen === 'transfer_account' ? "Next" : "Confirm"} icon={CheckCircle2} indexObj="OK" right />
                   {screen !== 'pin_entry' && <SideBtn id="side_r4" position={4} label="Cancel" icon={LogOut} indexObj="CX" right accent />}
                 </>
               )}
               {screen === 'balance' && (
                 <SideBtn id="side_r4" position={4} label="Return" icon={LogOut} indexObj="ESC" right accent />
               )}
               {screen === 'receipt_prompt' && (
                 <SideBtn id="side_r4" position={4} label="No Print" icon={LogOut} indexObj="NO" right accent />
               )}
               {screen === 'no_card' && (
                 <SideBtn id="side_r4" position={4} label="Get Card" icon={CheckCircle2} indexObj="NEW" right />
               )}
            </div>
        </>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        
        {/* ── WELCOME ────────────────────────────────────────────── */}
        {screen === 'welcome' && (
          <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 20px rgba(0,234,166,0.3))', 'drop-shadow(0 0 40px rgba(0,234,166,0.6))', 'drop-shadow(0 0 20px rgba(0,234,166,0.3))'] }} transition={{ duration: 3, repeat: Infinity }} className="w-[18vh] h-[18vh] bg-gradient-to-br from-brand to-[#047857] rounded-3xl flex items-center justify-center mb-8 relative border-2 border-white/20">
                <span className="font-display font-black text-[12vh] text-[#020617] drop-shadow-md">F</span>
            </motion.div>
            
            <h1 className="font-display font-black text-[9vh] tracking-widest text-slate-100 leading-none">FLEECA <span className="text-brand font-light">| SECURE</span></h1>
            
            <div className="mt-[6vh] flex items-center gap-[2vw] bg-[#0f172a]/80 border-[3px] border-slate-700/80 px-[4vw] py-[2.5vh] rounded-[2rem] shadow-2xl backdrop-blur-md">
              <CreditCard size={48} className="text-brand animate-pulse" />
              <p className="font-display font-bold text-[3vh] tracking-[0.2em] text-white">PLEASE INSERT CARD</p>
            </div>
          </motion.div>
        )}

        {/* ── CARD INSERT ────────────────────────────────────────────── */}
        {screen === 'card_insert' && (
          <motion.div key="card_insert" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 20px rgba(0,234,166,0.3))', 'drop-shadow(0 0 40px rgba(0,234,166,0.6))', 'drop-shadow(0 0 20px rgba(0,234,166,0.3))'] }} transition={{ duration: 3, repeat: Infinity }} className="w-[18vh] h-[18vh] bg-gradient-to-br from-brand to-[#047857] rounded-3xl flex items-center justify-center mb-8 relative border-2 border-white/20">
                <span className="font-display font-black text-[12vh] text-[#020617] drop-shadow-md">F</span>
            </motion.div>
            
            <h1 className="font-display font-black text-[9vh] tracking-widest text-slate-100 leading-none">FLEECA <span className="text-brand font-light">| SECURE</span></h1>
            
            <div className="mt-[6vh] flex items-center gap-[2vw] bg-[#0f172a]/80 border-[3px] border-slate-700/80 px-[4vw] py-[2.5vh] rounded-[2rem] shadow-2xl backdrop-blur-md">
              <CreditCard size={48} className="text-brand animate-bounce" />
              <p className="font-display font-bold text-[3vh] tracking-[0.2em] text-white">READING CARD DETAILS...</p>
            </div>
          </motion.div>
        )}

        {/* ── CARD EJECT ────────────────────────────────────────────── */}
        {screen === 'card_eject' && (
          <motion.div key="card_eject" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 20px rgba(0,234,166,0.3))', 'drop-shadow(0 0 40px rgba(0,234,166,0.6))', 'drop-shadow(0 0 20px rgba(0,234,166,0.3))'] }} transition={{ duration: 3, repeat: Infinity }} className="w-[18vh] h-[18vh] bg-gradient-to-br from-brand to-[#047857] rounded-3xl flex items-center justify-center mb-8 relative border-2 border-white/20">
                <span className="font-display font-black text-[12vh] text-[#020617] drop-shadow-md">F</span>
            </motion.div>
            
            <h1 className="font-display font-black text-[9vh] tracking-widest text-slate-100 leading-none">FLEECA <span className="text-brand font-light">| SECURE</span></h1>
            
            <div className="mt-[6vh] flex items-center gap-[2vw] bg-[#0f172a]/80 border-[3px] border-slate-700/80 px-[4vw] py-[2.5vh] rounded-[2rem] shadow-2xl backdrop-blur-md">
              <LogOut size={48} className="text-brand animate-bounce" />
              <p className="font-display font-bold text-[3vh] tracking-[0.2em] text-white">EJECTING CARD...</p>
            </div>
          </motion.div>
        )}

        {/* ── PIN ENTRY ─────────────────────────────────────────────────── */}
        {screen === 'pin_entry' && (
          <motion.div key="pin_entry" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
            <TopHeader title="Authentication" />
            <div className="w-full h-full flex flex-col items-center justify-center -mt-[10vh]">
              <div className="bg-[#0f172a]/95 border-x-[1px] border-y-[4px] border-b-slate-800 border-t-cyan-500 border-x-slate-800 p-[6vh] rounded-[3vw] shadow-2xl flex flex-col items-center w-[45%] backdrop-blur-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px]" />
                <ShieldCheck size={72} className="text-cyan-400 mb-6" strokeWidth={1.5} />
                <h2 className="font-display font-semibold text-[3.5vh] text-slate-300 mb-[4vh] tracking-widest">{session.pinTitle || "ENTER PIN CODE"}</h2>
                
                <div className="flex gap-[2vw] mb-[3vh] justify-center">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={cn(
                      "w-[4vh] h-[4vh] rounded-full transition-all duration-300",
                      i < pinDots 
                        ? "bg-cyan-400 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.8)]" 
                        : "bg-[#020617] border-2 border-slate-700 shadow-inner"
                    )} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── MAIN MENU ─────────────────────────────────────────────────── */}
        {screen === 'main_menu' && (
          <motion.div key="main_menu" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
            <TopHeader title="Account Overview" />
            <div className="absolute top-[20%] bottom-[12%] left-[26%] right-[26%] flex flex-col justify-center items-center z-20">
              <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-700/50 rounded-[2vw] p-[6vh] flex flex-col items-center w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                <h2 className="font-display font-medium text-[2.5vh] text-slate-400 mb-[1vh] uppercase tracking-widest">
                  Welcome Back,
                </h2>
                <h1 className="font-display font-black text-[5vh] text-white tracking-widest capitalize mb-[6vh]">
                  {session.playerName}
                </h1>
                
                <div className="flex flex-col items-center bg-[#020617]/50 w-full py-[4vh] rounded-3xl border border-slate-800 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                   <p className="font-sans font-bold text-[1.8vh] tracking-[0.4em] text-slate-500 mb-2">AVAILABLE BALANCE</p>
                   <div className="font-display font-black text-[10vh] text-white leading-none tracking-tighter drop-shadow-lg">
                     <span className="text-[6vh] text-brand align-top mr-2 font-light">$</span>
                     {formatMoney(session.bankBalance)}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── WITHDRAW (Quick Amounts) ──────────────────────────────────── */}
        {screen === 'withdraw' && (
          <motion.div key="withdraw" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
             <TopHeader title="Quick Actions" />
             <div className="absolute top-[20%] bottom-[12%] left-[26%] right-[26%] flex flex-col justify-center items-center z-20">
               <Landmark size={120} strokeWidth={1} className="text-slate-800 mb-8" />
               <p className="font-sans text-[2.5vh] text-slate-400 text-center tracking-widest leading-relaxed">
                  SELECT <br/> DESIRED AMOUNT
               </p>
               <div className="mt-8 bg-[#020617] px-8 py-3 rounded-full border border-slate-800">
                  <span className="text-brand font-bold">Limit:</span> ${formatMoney(session.bankBalance)}
               </div>
            </div>
          </motion.div>
        )}

        {/* ── AMOUNT ENTRY / TRANSFER ────────────────────────────────────────── */}
        {(screen === 'withdraw_amount' || screen === 'deposit' || screen === 'transfer_amount' || screen === 'transfer_account') && (
          <motion.div key="amount_entry" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
            <TopHeader title={screen === 'withdraw_amount' ? "Custom Withdrawal" : (screen === 'deposit' ? "Cash Deposit" : (screen === 'transfer_account' ? "Enter Routing #" : "Transfer Amount"))} />
            <div className="absolute top-[20%] bottom-[12%] left-[26%] right-[26%] flex flex-col justify-center items-center z-20">
               <div className="w-full flex flex-col items-center">
                 <p className="font-display font-bold text-[2.5vh] uppercase text-cyan-500 mb-[4vh] tracking-widest">{screen === 'transfer_account' ? "Enter Destination" : "Enter Value"}</p>
                 <div className="bg-[#020617]/80 w-full py-[4vh] rounded-[2rem] border-[3px] border-cyan-500 flex justify-center items-center mb-[4vh] shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <span className="font-display font-black text-[10vh] text-white flex items-center leading-none tracking-tighter">
                      {screen !== 'transfer_account' && <span className="text-[6vh] text-cyan-500 mr-2 font-light">$</span>}
                      {inputValue}
                      <span className="inline-block w-[6px] h-[7vh] bg-cyan-400 ml-4 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    </span>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS ───────────────────────────────────────────────────── */}
        {screen === 'success' && (
          <motion.div key="success" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="bg-gradient-to-b from-[#0f172a] to-[#020617] border-[1px] border-slate-800 rounded-[3vw] p-[8vh] flex flex-col items-center w-[55%] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
               <div className="w-[14vh] h-[14vh] bg-emerald-500/20 rounded-full flex items-center justify-center mb-[4vh] border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 size={80} className="text-emerald-400" strokeWidth={2} />
               </div>
               
               <h2 className="font-display font-black text-[4.5vh] text-slate-100 tracking-widest mb-[6vh] uppercase text-center">{successData.msg}</h2>
               
               <div className="w-full">
                  <div className="flex justify-between items-end mb-[3vh] pb-[2vh] border-b-[1px] border-slate-800">
                     <span className="font-sans font-medium text-[2vh] text-slate-500 tracking-[0.2em]">PROCESSED</span>
                     <span className="font-display font-black text-[4vh] text-white">${formatMoney(successData.amt)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="font-sans font-medium text-[2vh] text-emerald-500 tracking-[0.2em]">REMAINING</span>
                     <span className="font-display font-black text-[4vh] text-emerald-400">${formatMoney(successData.bal)}</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* ── BALANCE ───────────────────────────────────────────────────── */}
        {screen === 'balance' && (
          <motion.div key="balance" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
            <TopHeader title="Account Balance" />
            <div className="absolute top-[20%] bottom-[12%] left-[26%] right-[26%] flex flex-col justify-center items-center z-20">
              <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-700/50 rounded-[2vw] p-[6vh] flex flex-col items-center w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col items-center bg-[#020617]/50 w-full py-[4vh] rounded-3xl border border-slate-800 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                   <p className="font-sans font-bold text-[1.8vh] tracking-[0.4em] text-slate-500 mb-2">CURRENT BALANCE</p>
                   <div className="font-display font-black text-[10vh] text-white leading-none tracking-tighter drop-shadow-lg">
                     <span className="text-[6vh] text-cyan-500 align-top mr-2 font-light">$</span>
                     {formatMoney(session.bankBalance)}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RECEIPT PROMPT ────────────────────────────────────────────── */}
        {screen === 'receipt_prompt' && (
          <motion.div key="receipt" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
            <TopHeader title="Transaction Complete" />
            <div className="absolute top-[20%] bottom-[12%] left-[26%] right-[26%] flex flex-col justify-center items-center z-20">
                <FileText size={100} className="text-slate-700 mb-[4vh]" strokeWidth={1} />
                <h2 className="font-display font-black text-[5vh] text-white uppercase tracking-widest mb-[2vh]">Print Receipt?</h2>
            </div>
          </motion.div>
        )}

        {/* ── NO CARD ────────────────────────────────────────────── */}
        {screen === 'no_card' && (
          <motion.div key="no_card" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-20 pt-[15%]">
            <TopHeader title="Card Required" />
            <div className="absolute top-[20%] bottom-[12%] left-[26%] right-[26%] flex flex-col justify-center items-center z-20">
              <CreditCard size={100} className="text-red-500 mb-[4vh] animate-pulse" strokeWidth={1} />
              <h2 className="font-display font-black text-[4vh] text-white uppercase tracking-widest text-center mb-[2vh]">CARD NOT DETECTED</h2>
              <p className="text-slate-400 text-[2vh] text-center max-w-[80%]">
                You need a bank card to access ATM services it seems. Would you like to issue a new card now? It will cost you an issuing fee.
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── OVERLAYS ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {processing.active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-[#020617]/80 backdrop-blur-2xl flex flex-col items-center justify-center">
             <div className="relative flex justify-center items-center">
                <div className="w-32 h-32 border-4 border-slate-800 rounded-full" />
                <div className="w-32 h-32 border-4 border-brand rounded-full absolute top-0 border-t-transparent animate-spin" />
             </div>
             <h2 className="font-display font-medium text-[3vh] text-brand uppercase tracking-[0.4em] mt-8 animate-pulse">Processing</h2>
             
             {processing.duration && (
               <div className="w-[40vh] mt-10 bg-slate-900 border border-slate-800 p-1 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${processing.progress || 0}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className="h-2 bg-brand rounded-full shadow-[0_0_15px_rgba(0,234,166,0.6)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[1.2vh] font-mono text-white mix-blend-difference">
                    {Math.round(processing.progress || 0)}%
                  </div>
               </div>
             )}
          </motion.div>
        )}
        
        {toast && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="absolute top-[5vh] left-0 right-0 z-[200] flex justify-center">
            <div className={cn(
              "px-[3vw] py-[2vh] flex items-center gap-[1vw] border rounded-2xl shadow-2xl backdrop-blur-md",
              toast.type === 'error' ? "bg-red-950/90 border-red-500/50 text-white" : "bg-emerald-950/90 border-brand/50 text-white"
            )}>
              <span className={cn("w-[2vh] h-[2vh] rounded-full", toast.type === 'error' ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" : "bg-brand animate-pulse shadow-[0_0_10px_rgba(0,234,166,1)]")} />
              <span className="font-display text-[2vh] font-bold tracking-[0.1em] uppercase">{toast.msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DEV MODE CONSOLE ──────────────────────────────────────────── */}
      {!isNative && (
        <div className="absolute top-4 left-[30%] z-[999] bg-[#0f172a]/95 border-2 border-brand/50 p-4 rounded-xl shadow-2xl shadow-brand/10 w-72 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-brand font-display font-bold text-lg uppercase tracking-wider">Dev UI</h3>
          </div>
          <select value={screen} onChange={e => setScreen(e.target.value as ScreenType)} className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white text-sm mb-2 outline-none">
            <option value="welcome">Welcome</option><option value="pin_entry">PIN Entry</option>
            <option value="main_menu">Main Menu</option><option value="withdraw">Withdraw</option>
            <option value="withdraw_amount">Withdraw Amount</option><option value="success">Success</option>
            <option value="receipt_prompt">Receipt Prompt</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setProcessing({ active: !processing.active })} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 rounded border border-slate-700 transition">Process</button>
            <button onClick={() => { setToast({msg:'System Error', type:'error'}); setTimeout(() => setToast(null), 2000)}} className="flex-1 bg-red-900/50 hover:bg-red-900 text-white text-xs py-2 rounded border border-red-800 transition">Error</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}