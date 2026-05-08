'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    num: '01',
    title: 'Criatividade Estratégica',
    text: 'Direção criativa embasada em inteligência de mercado, dados de intenção e arquitetura de conversão.',
  },
  {
    num: '02',
    title: 'Velocidade de Execução',
    text: 'Sprints ágeis do conceito ao lançamento, sem abrir mão do acabamento e da performance.',
  },
  {
    num: '03',
    title: 'Crescimento Confiável',
    text: 'Processo transparente, resultados mensuráveis e otimização contínua em cada etapa.',
  },
];

export function About() {
  return (
    <section id="sobre" className="border-t border-border/[0.08] py-24 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="section-kicker mb-5">Sobre</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Uma agência com identidade própria para marcas que{' '}
              <em className="italic text-accent">recusam o ordinário.</em>
            </h2>
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-lg text-fg/50 leading-relaxed mb-12"
            >
              De São Paulo para mercados ambiciosos, combinamos estratégia precisa e energia criativa
              para gerar demanda, autoridade e receita.
            </motion.p>

            <div>
              {pillars.map((p, i) => (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="border-t border-border/[0.08] py-6 flex gap-5 items-start"
                >
                  <span className="text-xs font-mono text-fg/25 mt-0.5 shrink-0">{p.num}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1.5">{p.title}</p>
                    <p className="text-sm text-fg/45 leading-relaxed">{p.text}</p>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-border/[0.08]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
