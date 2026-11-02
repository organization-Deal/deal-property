'use client';
import {useEffect,useRef,type ReactNode} from 'react';
export default function AdminModal({children,onClose,busy=false,label}:{children:ReactNode;onClose:()=>void;busy?:boolean;label:string}){const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[]);return <dialog ref={ref} className="cms-modal-shell" aria-label={label} onCancel={e=>{e.preventDefault();if(!busy)onClose()}} onClick={e=>{if(e.target===ref.current&&!busy)onClose()}}>{children}</dialog>}
