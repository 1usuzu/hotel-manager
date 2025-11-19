import React from "react";

/*
  Modal đơn giản: backdrop + panel
  Props:
    - open (bool)
    - onClose (fn)
    - children
*/
export default function Modal({ open, onClose, children }){
  if(!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
