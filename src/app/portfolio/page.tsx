"use client";

import { useState } from 'react';
import styles from './page.module.css';

const portfolioData = [
  {
    id: 'cliente1',
    name: 'TechFlow',
    services: ['Automação de Vendas', 'Landing Page', 'Tráfego Pago'],
    testimonial: 'A HSB transformou nossa captação. Dobramos nossos leads em 3 meses com as automações no n8n.',
    gallery: ['/gallery1.jpg', '/gallery2.jpg']
  },
  {
    id: 'cliente2',
    name: 'Lumio',
    services: ['Design Premium', 'E-commerce', 'SEO'],
    testimonial: 'O nível de detalhe e a performance das animações no site superou todas as expectativas.',
    gallery: ['/gallery3.jpg', '/gallery4.jpg']
  }
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState(portfolioData[0].id);

  const activeClient = portfolioData.find(c => c.id === activeTab);

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div className={styles.container}>
          <h1 className="text-gradient">Nosso Portfólio</h1>
          <p>Resultados reais construídos com estratégia e design impecável.</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            {portfolioData.map((client) => (
              <button 
                key={client.id}
                className={`${styles.tabBtn} ${activeTab === client.id ? styles.active : ''}`}
                onClick={() => setActiveTab(client.id)}
              >
                {client.name}
              </button>
            ))}
          </div>

          {activeClient && (
            <div className={`${styles.clientPanel} glass-panel`}>
              <div className={styles.clientInfo}>
                <h2 className="text-gradient">{activeClient.name}</h2>
                
                <div className={styles.services}>
                  <h3>Serviços Realizados:</h3>
                  <ul>
                    {activeClient.services.map((srv, i) => (
                      <li key={i}>{srv}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.testimonial}>
                  <p>"{activeClient.testimonial}"</p>
                </div>
              </div>

              <div className={styles.gallery}>
                {/* Placeholders for images/videos */}
                <div className={styles.galleryItem}>
                  <span>Imagem / Vídeo do Projeto</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
