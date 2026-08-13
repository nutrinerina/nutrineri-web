"use client";
import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './AgendaEnVivo.module.css';

type Slot = {
  id: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  modality: string | null;
};

export default function AgendaEnVivo({ 
  initialSlots, 
  todayStr, 
  tomorrowStr 
}: { 
  initialSlots: Slot[], 
  todayStr: string, 
  tomorrowStr: string 
}) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isLive, setIsLive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
    const supabase = createClient();

    // Listen to changes in appointments table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // Most bookings are updates to an existing 'available' slot
          schema: 'public',
          table: 'appointments',
        },
        (payload) => {
          const updatedSlot = payload.new as Slot;
          
          // Only care if it's for today or tomorrow
          if (updatedSlot.date === todayStr || updatedSlot.date === tomorrowStr) {
            
            setSlots((currentSlots) => {
              const oldSlot = currentSlots.find(s => s.id === updatedSlot.id);
              
              // If it just got booked, play sound
              if (oldSlot && oldSlot.status === 'available' && updatedSlot.status === 'booked') {
                audioRef.current?.play().catch(e => console.log('Audio play blocked', e));
              }

              return currentSlots.map(s => s.id === updatedSlot.id ? updatedSlot : s);
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Just in case someone books a totally new slot
          schema: 'public',
          table: 'appointments',
        },
        (payload) => {
          const newSlot = payload.new as Slot;
          if (newSlot.date === todayStr || newSlot.date === tomorrowStr) {
            if (newSlot.status === 'booked') {
              audioRef.current?.play().catch(e => console.log('Audio play blocked', e));
            }
            setSlots((currentSlots) => {
              // Add and sort by date and time
              const updated = [...currentSlots, newSlot];
              updated.sort((a, b) => {
                if (a.date !== b.date) return a.date.localeCompare(b.date);
                return a.time.localeCompare(b.time);
              });
              return updated;
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsLive(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsLive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [todayStr, tomorrowStr]);

  // Request interaction to allow sound to play later
  const enableSound = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;
      }).catch(e => console.log(e));
    }
  };

  const todaySlots = slots.filter(s => s.date === todayStr);
  const tomorrowSlots = slots.filter(s => s.date === tomorrowStr);

  const renderSlotCard = (slot: Slot) => {
    const isBooked = slot.status === 'booked';
    return (
      <div key={slot.id} className={`${styles.card} ${isBooked ? styles.cardBooked : styles.cardAvailable}`}>
        <div className={styles.cardHeader}>
          <span className={styles.time}>{slot.time.substring(0,5)}</span>
          {isBooked ? (
            <span className={styles.badgeBooked}>Reservado</span>
          ) : (
            <span className={styles.badgeAvailable}>Libre</span>
          )}
        </div>
        
        {isBooked && (
          <div className={styles.clientInfo}>
            <strong className={styles.name}>{slot.client_name}</strong>
            <a href={`https://wa.me/${slot.client_phone?.replace(/\D/g, '')}`} className={styles.phone} target="_blank" rel="noreferrer">
              📱 {slot.client_phone}
            </a>
            <span className={styles.modality}>
              📍 {slot.modality === 'online' ? 'Videollamada' : 'Consultorio'}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container} onClick={enableSound}>
      <div className={styles.statusBanner}>
        {isLive ? (
          <span className={styles.liveIndicator}>🟢 Conectado en vivo</span>
        ) : (
          <span className={styles.offlineIndicator}>🔴 Desconectado (Recarga la página)</span>
        )}
      </div>

      <div className={styles.daySection}>
        <h2 className={styles.dayTitle}>Hoy</h2>
        {todaySlots.length === 0 ? (
          <p className={styles.empty}>No hay turnos para hoy.</p>
        ) : (
          <div className={styles.grid}>{todaySlots.map(renderSlotCard)}</div>
        )}
      </div>

      <div className={styles.daySection}>
        <h2 className={styles.dayTitle}>Mañana</h2>
        {tomorrowSlots.length === 0 ? (
          <p className={styles.empty}>No hay turnos para mañana.</p>
        ) : (
          <div className={styles.grid}>{tomorrowSlots.map(renderSlotCard)}</div>
        )}
      </div>
    </div>
  );
}
