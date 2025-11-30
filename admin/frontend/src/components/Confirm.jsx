import React from "react";
import Modal from "./Modal.jsx";

/*
  Confirm dialog reuse
  Props:
    - open, onClose, onConfirm, title, message
*/
export default function Confirm({open, onClose, onConfirm, title="Xác nhận", message="Bạn có chắc?"}){
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{margin:0, color:"var(--accent)", fontWeight:700}}>{title}</h3>
      <p className="small" style={{marginTop:8}}>{message}</p>
      <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
        <button className="btn btn-outline" onClick={onClose}>Huỷ</button>
        <button className="btn btn-accept" onClick={()=>{ onConfirm(); onClose(); }}>Xác nhận</button>
      </div>
    </Modal>
  );
}
