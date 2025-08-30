
import React,{useEffect,useMemo,useState} from 'react';
import{Card,CardContent,CardDescription,CardHeader,CardTitle}from './ui/card';
import{Button}from './ui/button';
import{Badge}from './ui/badge';
import{Slider}from './ui/slider';
import{Tooltip,TooltipContent,TooltipProvider,TooltipTrigger}from './ui/tooltip';
import{Tabs,TabsContent,TabsList,TabsTrigger}from './ui/tabs';
import{ChevronRight,TrendingUp,TrendingDown,DollarSign,Activity,Zap}from 'lucide-react';
import{motion,AnimatePresence}from 'motion/react';
import{ResponsiveContainer,LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip as RechartsTooltip,ReferenceLine,ReferenceArea}from 'recharts';
import{GreeksExplainer,OptionsData}from './GreeksExplainer';
import{StrategyVisualizer}from './StrategyVisualizer';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { GreeksExplainer, OptionsData } from './GreeksExplainer';
import { StrategyCard } from './StrategyCard';
import { OptionsParameters } from './OptionsParameters';
import {
  optionsStrategies,
  OptionsStrategy,
  PayoffPoint,
} from '../lib/strategies';
import {
  validateParameters,
  safePayoffCalculation,
} from '../lib/optionsUtils';


export { validateParameters } from '../lib/optionsUtils';

export const InteractiveOptionsChart = () => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(
    null,
  );
  const [optionsData, setOptionsData] = useState<OptionsData>({
    strikePrice: 100,
    currentPrice: 100,
    premium: 5,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  });
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const handlePreset = (p: OptionsData) => {
    validateParameters(p);
    setOptionsData(p);
  };


type TooltipInfo={title:string;content:string};
const parameterTooltips:Record<keyof OptionsData,TooltipInfo>={currentPrice:{title:'Current Stock Price (S)',content:'The current market price of the underlying stock. This determines option moneyness.'},strikePrice:{title:'Strike Price (K)',content:'The exercise price of the option contract.'},premium:{title:'Option Premium',content:'The price paid for the option contract. For short strategies this is the credit received.'},daysToExpiry:{title:'Days to Expiry (T)',content:'Number of days until the option expires. Shorter durations increase time decay (Theta).'},impliedVolatility:{title:'Implied Volatility (IV)',content:'Expected volatility of the underlying over the life of the option. Higher IV increases option premiums.'},interestRate:{title:'Risk-free Interest Rate (r)',content:'Annualized interest rate used in option pricing models. Higher rates generally raise call values and lower put values.'},dividendYield:{title:'Dividend Yield (q)',content:'Expected annual dividend yield of the underlying stock. Dividends decrease call values and increase put values.'}};

  const handleWalkthroughClose = () => setShowWalkthrough(false);


  useEffect(() => {
    try {
      validateParameters(optionsData);
    } catch (e) {
      console.error((e as Error).message);
    }
  }, [optionsData]);


export const validateParameters=(d:OptionsData)=>{if(d.strikePrice<=0)throw new Error('Strike price must be positive');if(d.premium<0)throw new Error('Premium cannot be negative');if(d.daysToExpiry<=0)throw new Error('Days to expiry must be positive');};
const safePayoffCalculation=(s:number,strategy:OptionsStrategy,o:OptionsData)=>{try{return strategy.calculatePayoff(s,o);}catch(e){console.warn('Payoff calculation error:',e);return 0;}};

  const generatePayoffData = useMemo(
    () => (strategy: OptionsStrategy): PayoffPoint[] => {
      const data: PayoffPoint[] = [];
      const minPrice = Math.max(0, optionsData.strikePrice - 30);
      const maxPrice = optionsData.strikePrice + 30;


      for (let price = minPrice; price <= maxPrice; price += 2) {
        const payoff = safePayoffCalculation(price, strategy, optionsData);
        data.push({ stockPrice: price, profitLoss: payoff });
      }

      return data;
    },
    [optionsData],
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2">Options Trading Strategies</h1>
        <p className="text-gray-600">
          Explore different options strategies and learn how their payoffs and
          Greeks work.
        </p>
      </div>
      {showWalkthrough && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card>
            <CardContent>
              <p>Welcome to the walkthrough!</p>
              <Button onClick={handleWalkthroughClose}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
      <OptionsParameters
        optionsData={optionsData}
        onChange={setOptionsData}
        onPreset={handlePreset}
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Options Greeks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GreeksExplainer optionsData={optionsData} />
        </CardContent>
      </Card>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {optionsStrategies.map((s) => (
          <StrategyCard
            key={s.id}
            strategy={s}
            isExpanded={expandedStrategy === s.id}
            onToggle={(id) =>
              setExpandedStrategy(expandedStrategy === id ? null : id)
            }
            optionsData={optionsData}
            generatePayoffData={generatePayoffData}
          />
        ))}

const XAxisLabel=({viewBox}:{viewBox:any})=>{
 const {x,y,width}=viewBox;
 return(
  <Tooltip>
   <TooltipTrigger asChild>
    <text x={x+width/2} y={y+30} textAnchor="middle">Stock Price ($)</text>
   </TooltipTrigger>
   <TooltipContent>
    <p className="text-xs">Horizontal axis shows possible stock prices at expiration.</p>
   </TooltipContent>
  </Tooltip>
 );
};

const YAxisLabel=({viewBox}:{viewBox:any})=>{
 const {x,y,height}=viewBox;
 return(
  <Tooltip>
   <TooltipTrigger asChild>
    <text
     x={x-40}
     y={y+height/2}
     textAnchor="middle"
     transform={`rotate(-90, ${x-40}, ${y+height/2})`}
    >
     Profit/Loss ($)
    </text>
   </TooltipTrigger>
   <TooltipContent>
    <p className="text-xs">Vertical axis shows profit or loss per share.</p>
   </TooltipContent>
  </Tooltip>
 );
};

export const InteractiveOptionsChart=()=>{
 const[expandedStrategy,setExpandedStrategy]=useState<string|null>(null);
 const[selectedTab,setSelectedTab]=useState<'chart'|'education'>('chart');
 const[optionsData,setOptionsData]=useState<OptionsData>({strikePrice:100,currentPrice:100,premium:5,daysToExpiry:30,impliedVolatility:25,interestRate:5,dividendYield:2});
 const[showWalkthrough,setShowWalkthrough]=useState(false);
 const handlePreset=(p:OptionsData)=>{validateParameters(p);setOptionsData(p);};
 const handlePreset=(p:OptionsData)=>{
  try{validateParameters(p);setOptionsData(p);}catch(e){console.warn('Invalid preset',e);}
 };
 const handleWalkthroughClose=()=>setShowWalkthrough(false);
 useEffect(()=>{try{validateParameters(optionsData);}catch(e){console.error((e as Error).message);}},[optionsData]);
 const generatePayoffData=useMemo(()=>{return(strategy:OptionsStrategy):PayoffPoint[]=>{const data:PayoffPoint[]=[];const minPrice=Math.max(0,optionsData.strikePrice-30);const maxPrice=optionsData.strikePrice+30;for(let price=minPrice;price<=maxPrice;price+=2){const payoff=safePayoffCalculation(price,strategy,optionsData);data.push({stockPrice:price,profitLoss:payoff});}return data;};},[optionsData]);

const ParameterSlider=(label:keyof OptionsData,min:number,max:number,step:number)=>(
 <div className="mb-4" key={label}>
  <div className="flex justify-between mb-1">
   <span className="text-sm capitalize">{label.replace(/([A-Z])/g,' $1')}</span>
   <span className="text-sm">{optionsData[label]}</span>
  </div>
  <Tooltip>
   <TooltipTrigger>
    <Slider
     aria-label={label}
     aria-valuetext={`${optionsData[label]}`}
     min={min}
     max={max}
     step={step}

     value={optionsData[label]}
     onValueChange={(v)=>setOptionsData(prev=>({...prev,[label]:v}))}

     value={[optionsData[label]]}
     onValueChange={(v)=>setOptionsData(prev=>{
      const updated={...prev,[label]:v[0]};
      try{validateParameters(updated);return updated;}catch(e){console.warn('Invalid parameters',e);return prev;}
     })}

    />
   </TooltipTrigger>
   <TooltipContent>
    <strong>{parameterTooltips[label].title}</strong>
    <p>{parameterTooltips[label].content}</p>
   </TooltipContent>
  </Tooltip>
 </div>
);


const StrategyCard=({strategy}:{strategy:OptionsStrategy})=>{const isExpanded=expandedStrategy===strategy.id;const payoffData=generatePayoffData(strategy);const maxPayoff=Math.max(...payoffData.map(p=>p.profitLoss));const minPayoff=Math.min(...payoffData.map(p=>p.profitLoss));return(<motion.div layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.3}}><Card><CardHeader onClick={()=>setExpandedStrategy(isExpanded?null:strategy.id)} className="cursor-pointer"><CardTitle className="flex items-center gap-2">{strategy.title}<ChevronRight className={`w-4 h-4 transition-transform ${isExpanded?'rotate-90':''}`}/></CardTitle><CardDescription>{strategy.description}</CardDescription><div className="flex gap-1 mt-2"><Badge className={getCategoryColor(strategy.category)}>{strategy.category}</Badge><Badge className={getComplexityColor(strategy.complexity)}>{strategy.complexity}</Badge><Badge className={getRiskColor(strategy.riskLevel)}>{strategy.riskLevel}</Badge></div></CardHeader><AnimatePresence>{isExpanded&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}}><CardContent><Tabs value={selectedTab} onValueChange={(v)=>setSelectedTab(v as 'chart'|'education')}><TabsList><TabsTrigger value="chart">Chart</TabsTrigger><TabsTrigger value="education">Education</TabsTrigger></TabsList><TabsContent value="chart"><div className="w-full h-96"><ResponsiveContainer width="100%" height="100%"><LineChart data={payoffData}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="stockPrice" label={{value:'Stock Price ($)',position:'insideBottom',offset:-5}}/><YAxis label={{value:'Profit/Loss ($)',angle:-90,position:'insideLeft'}}/><ReferenceArea y1={0} y2={maxPayoff} fill="rgba(34,197,94,0.1)"/><ReferenceArea y1={minPayoff} y2={0} fill="rgba(239,68,68,0.1)"/><Line type="monotone" dataKey="profitLoss" stroke="#2563eb" strokeWidth={3} dot={false}/><ReferenceLine y={0} stroke="#374151" strokeDasharray="2 2" strokeWidth={2}/><ReferenceLine x={optionsData.currentPrice} stroke="#2563eb" strokeDasharray="4 4" strokeWidth={2}/><RechartsTooltip content={({active,payload,label})=>{if(active&&payload&&payload.length){return(<div className="p-2 bg-white border rounded text-sm"><p>Stock: {label}</p><p>P/L: {payload[0].value}</p><p>{payload[0].value>0?'Above the breakeven price the strategy yields a profit':'Below the breakeven price the strategy loses'}</p></div>);}return null;}}/></LineChart></ResponsiveContainer></div></TabsContent><TabsContent value="education"><StrategyVisualizer legs={strategy.legs} optionsData={optionsData}/><ul className="list-disc pl-5 mt-2 text-sm">{strategy.whenToUse.map(w=>(<li key={w}>{w}</li>))}</ul></TabsContent></Tabs></CardContent></motion.div>)}</AnimatePresence></Card></motion.div>);};

const StrategyCard=({strategy}:{strategy:OptionsStrategy})=>{
 const isExpanded=expandedStrategy===strategy.id;
 const payoffData=generatePayoffData(strategy);
 const maxPayoff=Math.max(...payoffData.map(p=>p.profitLoss));
 const minPayoff=Math.min(...payoffData.map(p=>p.profitLoss));
 return(
  <motion.div layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
   <Card>
    <CardHeader onClick={()=>setExpandedStrategy(isExpanded?null:strategy.id)} className="cursor-pointer">
     <CardTitle className="flex items-center gap-2">
      {strategy.title}
      <motion.div animate={{rotate:isExpanded?90:0}} transition={{duration:0.2}}>
       <ChevronRight className="w-4 h-4"/>
      </motion.div>
     </CardTitle>
     <CardDescription>{strategy.description}</CardDescription>
     <div className="flex gap-1 mt-2">
      <Badge className={getCategoryColor(strategy.category)}>{strategy.category}</Badge>
      <Badge className={getComplexityColor(strategy.complexity)}>{strategy.complexity}</Badge>
      <Badge className={getRiskColor(strategy.riskLevel)}>{strategy.riskLevel}</Badge>
     </div>
    </CardHeader>
    <AnimatePresence>
     {isExpanded&&(
      <motion.div
       initial={{height:0,opacity:0}}
       animate={{height:'auto',opacity:1}}
       exit={{height:0,opacity:0}}
       transition={{duration:0.3}}
      >
       <CardContent>
        <Tabs value={selectedTab} onValueChange={(v)=>setSelectedTab(v as 'chart'|'education')}>
         <TabsList>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
         </TabsList>
         <TabsContent value="chart">
          <div className="w-full h-96">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={payoffData}>
             <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
             <XAxis dataKey="stockPrice" label={<XAxisLabel/>}/>
             <YAxis label={<YAxisLabel/>}/>
             <ReferenceArea y1={0} y2={maxPayoff} fill="rgba(34,197,94,0.1)"/>
             <ReferenceArea y1={minPayoff} y2={0} fill="rgba(239,68,68,0.1)"/>
             <Line type="monotone" dataKey="profitLoss" stroke="#2563eb" strokeWidth={3} dot={false}/>
             <ReferenceLine y={0} stroke="#374151" strokeDasharray="2 2" strokeWidth={2}/>
             <ReferenceLine x={optionsData.currentPrice} stroke="#2563eb" strokeDasharray="4 4" strokeWidth={2}/>
             <RechartsTooltip content={({active,payload,label})=>{
              if(active&&payload&&payload.length){
               const value=payload[0].value as number;
               return(
                <div className="p-2 bg-white border rounded text-sm">
                 <p>Stock: {label}</p>
                 <p>P/L: {value}</p>
                 <p>{value>0?'Above the breakeven price the strategy yields a profit':'Below the breakeven price the strategy loses'}</p>
                </div>
               );
              }
              return null;
             }}/>
            </LineChart>
           </ResponsiveContainer>
          </div>
         </TabsContent>
         <TabsContent value="education">
          <StrategyVisualizer legs={strategy.legs}/>
          <ul className="list-disc pl-5 mt-2 text-sm">
           {strategy.whenToUse.map(w=>(
            <li key={w}>{w}</li>
           ))}
          </ul>
         </TabsContent>
        </Tabs>
       </CardContent>
      </motion.div>
     )}
    </AnimatePresence>
   </Card>
  </motion.div>
 );
};


 return(
  <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
   <div className="text-center mb-8">
    <h1 className="mb-2">Options Trading Strategies</h1>
    <p className="text-gray-600">Explore different options strategies and learn how their payoffs and Greeks work.</p>
   </div>
   {showWalkthrough&&(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
     <Card>
      <CardContent>
       <p>Welcome to the walkthrough!</p>
       <Button onClick={handleWalkthroughClose}>Close</Button>
      </CardContent>
     </Card>
    </div>
   )}
   <TooltipProvider>
    <Card className="mb-6">
     <CardHeader>
      <CardTitle className="flex items-center gap-2">
       <Activity className="w-5 h-5"/>
       Market Parameters & Option Pricing Inputs
      </CardTitle>
     </CardHeader>
     <CardContent>
      {ParameterSlider('currentPrice',50,200,1)}
      {ParameterSlider('strikePrice',50,200,5)}
      {ParameterSlider('premium',0.5,30,0.25)}
      {ParameterSlider('daysToExpiry',1,365,1)}
      {ParameterSlider('impliedVolatility',5,100,1)}
      {ParameterSlider('interestRate',0,10,0.1)}
      {ParameterSlider('dividendYield',0,5,0.1)}
      <div className="flex gap-2 mt-4">
       {Object.entries(quickPresets).map(([k,v])=> (
        <Button key={k} onClick={()=>handlePreset(v as OptionsData)}>{k}</Button>
       ))}

      </div>
      <p className="text-xs text-center text-muted-foreground mt-8">
        This tool is for educational purposes only and does not constitute
        financial advice.
      </p>
    </div>
  );
};

