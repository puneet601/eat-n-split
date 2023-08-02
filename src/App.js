import { useState } from "react";
import "./index.css";
export default function App() {
  const [initialFriends, setInitialFriends] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ]);
  const [curSelected, setCurSelected] = useState(null);
  const [addFriendForm, setAddFriendForm] = useState(false);
  function handleSplitBill(friend, val) {
    console.log(friend, val);
    const updatedCost = friend.balance + val;
    const newFrens = initialFriends.map((eachfriend) =>
      eachfriend.id === friend.id
        ? { ...eachfriend, balance: updatedCost }
        : eachfriend
    );
    console.log(newFrens);
    setInitialFriends(newFrens);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          initialFriends={initialFriends}
          curSelected={curSelected}
          setCurSelected={setCurSelected}
        />

        {addFriendForm ? (
          <>
            <AddFriend
              initialFriends={initialFriends}
              setInitialFriends={setInitialFriends}
            />
            <Button>Close</Button>
          </>
        ) : (
          <Button onClickButton={() => setAddFriendForm(!addFriendForm)}>
            Add Friend
          </Button>
        )}
      </div>
      {curSelected !== null && (
        <>
          <Bill
            initialFriends={initialFriends}
            curSelected={curSelected}
            handleSplitBill={handleSplitBill}
          />
        </>
      )}
    </div>
  );
}

function FriendList({ initialFriends, curSelected, setCurSelected }) {
  return (
    <ul>
      {initialFriends.map((friend, index) => (
        <Friend
          key={index}
          friend={friend}
          curSelected={curSelected}
          onSelection={setCurSelected}
        />
      ))}
    </ul>
  );
}

function Friend({ key, friend, curSelected, onSelection }) {
  const isSelected = curSelected === friend;
  return (
    <li key={key}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <BalanceStatus balance={friend.balance} name={friend.name} />
      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function BalanceStatus({ balance, name }) {
  return (
    <>
      {balance === 0 && <p>{`You and ${name} are clear`}</p>}
      {balance > 0 && (
        <p className="green">{`${name} owes you ${Math.abs(balance)}`}</p>
      )}
      {balance < 0 && (
        <p className="red">{`You owe ${name} ${Math.abs(balance)}`}</p>
      )}
    </>
  );
}

function AddFriend({ initialFriends, setInitialFriends }) {
  const [name, setName] = useState("");
  const [imgLink, setImgLink] = useState("");
  function handleAddFriend(e) {
    e.preventDefault();
    const newFriend = {
      id: crypto.randomUUID(),
      name,
      image: imgLink,
      balance: 0,
    };
    setInitialFriends([...initialFriends, newFriend]);
    setName("");
    setImgLink("");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleAddFriend(e)}>
      <label>🫂Friend name</label>
      <input
        type="text"
        placeholder="Friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        placeholder="image link"
        value={imgLink}
        onChange={(e) => setImgLink(e.target.value)}
        required
      />
      <Button>Add</Button>
    </form>
  );
}
function Button({ onClickButton, children }) {
  return (
    <button className="button" onClick={onClickButton}>
      {children}
    </button>
  );
}
function Bill({ initialFriends, curSelected, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [payer, setPayer] = useState(-1);
  const friend = curSelected;

  function handleSubmit(e) {
    e.preventDefault();
    payer === friend.id
      ? handleSplitBill(friend, -yourExpense)
      : handleSplitBill(friend, bill - yourExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {friend.name.toUpperCase()}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🤌Your expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) => setYourExpense(e.target.value)}
      />
      <label>🫂{friend.name}'s expense</label>
      <input
        type="text"
        value={bill - yourExpense === 0 ? "" : bill - yourExpense}
        disabled
      />
      <label>🤑Who is paying the bill ?</label>
      <select onChange={(e) => setPayer(e.target.value)}>
        <option value="-1">You</option>
        <option value={friend.id}>{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
