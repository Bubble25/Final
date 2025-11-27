"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    quantity: 0,
    image: "",
    origin: "",
    price_per_kg: 0,
  });
  const [editing, setEditing] = useState(false);

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  // Fetch all fruits
  const fetchFruits = async () => {
    try {
      const res = await fetch(`${apiHost}/fruits`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch fruits");
      const data = await res.json();
      setFruits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add or Update fruit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${apiHost}/fruits/${form.id}` : `${apiHost}/fruits`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          quantity: Number(form.quantity),
          image: form.image,
          origin: form.origin,
          price_per_kg: Number(form.price_per_kg),
        }),
      });
      if (!res.ok) throw new Error("Failed to save fruit");
      setForm({ id: null, name: "", description: "", quantity: 0, image: "", origin: "", price_per_kg: 0 });
      setEditing(false);
      fetchFruits();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit fruit
  const handleEdit = (fruit) => {
    setForm(fruit);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete fruit
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this fruit?")) return;
    try {
      const res = await fetch(`${apiHost}/fruits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete fruit");
      fetchFruits();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="empty">Loading fruits...</div>;
  if (error) return <div className="empty">Error: {error}</div>;

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">Fruit Warehouse Admin</h1>
        <p className="subtitle">Manage your fruit inventory</p>
      </header>

      {/* Fruit Form */}
      <section className="card" style={{ marginBottom: "2rem", padding: "1rem" }}>
        <h3>{editing ? "Edit Fruit" : "Add New Fruit"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity (kg)" required />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
          <input name="origin" value={form.origin} onChange={handleChange} placeholder="Origin" />
          <input name="price_per_kg" type="number" step="0.01" value={form.price_per_kg} onChange={handleChange} placeholder="Price per kg" required />
          <button type="submit">{editing ? "Update Fruit" : "Add Fruit"}</button>
          {editing && <button type="button" onClick={() => { setEditing(false); setForm({ id: null, name: "", description: "", quantity: 0, image: "", origin: "", price_per_kg: 0 }); }}>Cancel</button>}
        </form>
      </section>

      {/* Fruits List */}
      {!fruits.length ? (
        <div className="empty">No fruits found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {fruits.map((fruit) => (
            <article key={fruit.id} className="card" tabIndex={0}>
              {fruit.image && (
                <div className="media">
                  <img src={fruit.image} alt={fruit.name} className="img" loading="lazy" decoding="async" />
                </div>
              )}
              <div className="body">
                <h3 className="card-title">{fruit.name}</h3>
                {fruit.description && <p className="detail">{fruit.description}</p>}
                <div className="meta">
                  <small>Quantity: {fruit.quantity} kg</small>
                  <small>Origin: {fruit.origin}</small>
                  <small className="price">Price: ${fruit.price_per_kg}</small>
                </div>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleEdit(fruit)}>Edit</button>
                  <button onClick={() => handleDelete(fruit.id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
