import React, { useState } from 'react';
import { Quote, Copy } from 'lucide-react';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis',
  'unde', 'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium',
  'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa',
  'quae', 'ab', 'illo', 'inventore', 'veritatis', 'quasi', 'architecto',
  'beatae', 'vitae', 'dicta', 'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas',
  'aspernatur', 'aut', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores',
  'eos', 'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'nemo',
  'qui', 'dolorem', 'ipsum', 'quia', 'dolor', 'sit', 'amet', 'consectetur',
];

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const generateWords = (count) => {
  const selected = [];

  for (let i = 0; i < count; i++) {
    selected.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }

  return selected.join(' ');
};

const generateLorem = ({ type, count }) => {
  const result = [];

  if (type === 'paragraphs') {
    for (let index = 0; index < count; index++) {
      const paragraphLength = Math.floor(Math.random() * 40) + 20;
      result.push(`${capitalize(generateWords(paragraphLength))}.`);
    }

    return result.join('\n\n');
  }

  if (type === 'sentences') {
    return `${capitalize(generateWords(count * 6))}.`;
  }

  return generateWords(count);
};

const LoremIpsum = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setOutput(generateLorem({ type, count }));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 glass-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Quote className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">LOREM IPSUM</h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl p-2 font-mono text-xs text-white outline-none focus:border-primary/50"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-16 bg-black/40 border border-white/10 rounded-xl p-2 font-mono text-xs text-white outline-none focus:border-primary/50 text-center"
          />
        </div>

        <button onClick={generate} className="py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
          Generate
        </button>

        <div className="flex flex-col gap-2 flex-grow relative">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Output</label>
          <textarea
            readOnly
            value={output}
            placeholder="Click generate to create placeholder text..."
            className="w-full h-32 bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-xs text-primary/80 outline-none resize-none"
          />
          {output && (
            <button onClick={copy} className="absolute right-3 bottom-3 p-1.5 bg-black/60 hover:bg-white/10 rounded-lg text-muted transition-colors">
              {copied ? <span className="text-green-500 text-[10px]">COPIED</span> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoremIpsum;
