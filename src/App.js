import { useState } from "react";

// Array yang berisi nama-nama hari
const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

//parent component
export default function App() {
  //destructuring array for states
  const [items, setItems] = useState([]);

  //handle add items to the state
  function handleAddItems(item) {
    const newItem = { 
      description: item.description, 
      quantity: item.quantity, 
      packed: item.packed, 
      day: item.day, 
      date: new Date().toLocaleDateString(), // Tambahkan properti date
      id: item.id 
    };
    setItems((items) => [...items, newItem]);
  }


  //handle delete items from the state
  function handleDeleteItem(id) {
    // console.log(id);
    setItems((items) => items.filter((item) => item.id !== id));
  }

  //handle update items from the state
  function handleUpdateItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  //render child components inside parent
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
      />
      <Stats items={items} />
    </div>
  );
}

//child component logo
function Logo() {
  return (
    <div>
      <h1> Absensi Kehadiran Siswa XI PPLG </h1>
    </div>
  );
}

//child component form
function Form({ onAddItems }) {
  //destructuring array for state
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState(""); // State untuk menyimpan tanggal yang dipilih

  // handle submission of form, by preventing its default behavior
  function handleSubmit(e) {
    e.preventDefault();

    //if empty description or date not selected
    if (!description || !selectedDate) return;

    const newItem = { 
      description, 
      quantity, 
      packed: false, 
      date: selectedDate, 
      id: Date.now() 
    };

    //store new item in array from parent state
    //called this function whenever form submitted
    onAddItems(newItem);

    //reset form fields
    setDescription("");
    setQuantity(1);
    setSelectedDate("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3> Nomor Absensi Siswa dan nama Siswa</h3>
      <input
        type="text"
        placeholder="Tulis Nama Siswa"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* Input tanggal */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button>Hadir</button>
    </form>
  );
}

//child component PackingList
function PackingList({ items, onDeleteItem, onUpdateItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onUpdateItem={onUpdateItem}
          />
        ))}
      </ul>
    </div>
  );
}

//sub-component PackingList
function Item({ item, onDeleteItem, onUpdateItem }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      {/* ternary operator to check simple condition */}
      {/* if item.packed === true then apply this style textDecoration: "line-through" 
      else don't do anything */}
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description} - {item.day} - {new Date(item.date).toLocaleDateString()} {/* Display full date */}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>(batalkan)</button>
    </li>
  );
}

//child component Stats
function Stats({ items }) {
  // jika tidak ada item pada array
  if (!items.length)
    return (
      <p className="stats">
        <em> Yang alpa jangan di list</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "Siswa kelas XI pplg telah hadir semua"
          : `Kelas XI PPLG mempunyai ${numItems} Siswa yang telah hadir, dan sudah siap belajar ${numPacked}
        siswa (${percentage}%)`}
      </em>
    </footer>
  );
}
