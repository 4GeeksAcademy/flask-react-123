import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import GoogleMaps from "../components/GoogleMaps";

function ModalCreateTask({ setShowTaskModal, taskType, taskToEdit = null }) {
    const { store, dispatch } = useGlobalReducer();
    const activeClanId = store.activeClanId;

    const isEditing = !!taskToEdit;
    const modalTitle = isEditing
        ? (taskType === 'user' ? "Editar Tarea Personal" : "Editar Tarea de Clan")
        : (taskType === 'user' ? "Nueva Tarea Personal" : "Nueva Tarea de Clan");



    // Estados
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [date, setDate] = useState("");
    const [lat, setLat] = useState(20);
    const [lng, setLng] = useState(-99);

    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.title || "");
            setDescripcion(taskToEdit.description || "");
            setDireccion(taskToEdit.address || "");
            setLat(taskToEdit.latitude || 20);
            setLng(taskToEdit.longitude || -99);
        } else {
            // Limpiar si es creación nueva
            setTitulo("");
            setDescripcion("");
            setDireccion("");
        }
    }, [taskToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMsg("");


        if (!titulo.trim()) {
            setMsg("El título es obligatorio.");
            return;
        }
        setTitulo("");
        setDescripcion("");
        setDireccion("");
        setDate("");
        setLat("");
        setLng("");
        setMsg("Tarea creada (mock)");

        const payloadData = {
            id: taskToEdit ? taskToEdit.id : undefined, // Importante para editar
            title: titulo,
            description: descripcion,
            address: direccion,
            latitude: lat,
            longitude: lng,
        };

        if (taskType === 'clan') {
            if (!isEditing && !activeClanId) {
                setMsg("Error: No hay clan activo.");
                return;
            }
            // Dispatch específico para CLAN (Crear o Editar)
            dispatch({
                type: isEditing ? 'UPDATE_CLAN_TASK' : 'ADD_TASK_TO_CLAN',
                payload: { ...payloadData, clanId: activeClanId }
            });
        } else {
            // Dispatch específico para USER (Crear o Editar)
            dispatch({
                type: isEditing ? 'UPDATE_USER_TASK' : 'ADD_USER_TASK',
                payload: payloadData
            });
        }

        setShowTaskModal(false);
    };
    console.log(lat, lng)

    return (
        <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", padding: "3rem" }}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="modal-content modal-content-dark" style={{ padding: "1.5rem" }} onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                            {modalTitle}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowTaskModal(false)}></button>
                    </div>
                    <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                    <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10, minHeight: 60 }} />
                    <input placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                    <GoogleMaps
                        lat={lat}
                        lng={lng}
                        setLat={setLat}
                        setLng={setLng}
                    />
                    <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                        <button type="submit" className="btn btn-custom-blue" style={{ fontWeight: 600, fontSize: 18 }}>Crear tarea</button>
                    </div>
                    <div style={{ color: "#7f00b2", marginTop: 16, textAlign: "center" }}>{msg}</div>
                </form>
            </div>
        </div>

    );
}

export default ModalCreateTask;