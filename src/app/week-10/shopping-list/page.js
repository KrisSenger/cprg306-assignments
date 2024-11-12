"use client"

import ItemList from "./item-list";
import NewItem from "./new-item";
import { useState, useEffect } from "react";
import MealIdeas from "./meal-ideas";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import { getItems, addItem } from "../_services/shopping-list-service";

export default function Page() {
    const [items, setItems] = useState([]);
    const [selectedItemName, setSelectedItemName] = useState("");
    const { user, firebaseSignOut } = useUserAuth();
    const router = useRouter();

    const handleAddItem = (item) => {
        try {
            const newItem = addItem(user.uid, item);
            item.id = newItem.id;
            setItems(prevItems => [...prevItems, item]);
            return item;
        } catch(error) {
            console.error("Error adding item: ", error);
        }
    };

    const handleItemSelect = (item) => {
        const itemReplace = item.name.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]| /g,'').trim().split(",")[0];
        setSelectedItemName(itemReplace);
    };

    const signOut = async () => {
        await firebaseSignOut();
        router.push("/week-9");
    };

    const loadItems = async () => {
        try {
            const items = await getItems(user.uid);
            setItems(items);
        } catch(error) {
            console.error("Error loading items: ", error);
        }
    };

    useEffect(() => {
        if (user) {
            loadItems();
        }
    }, [user]);


    if (!user) {
        return (
            <main>
                <div className="flex flex-col text-center items-center">
                    <img src="/images/dog2.jpg" alt="guard puppy" width={400}/>
                    <p className="text-3xl">You're not allowed to be here!</p>
                </div>
            </main>
        );
    }


    return (
        <main className="bg-black h-screen flex">
            <div className="flex flex-col m-5">
                <h1 className="font-bold text-2xl text-center mb-4">Shopping List</h1>
                <NewItem onAddItem={handleAddItem}/>
                <ItemList items={items} onItemSelect={handleItemSelect}/>
            </div>

            <div className="absolute right-0 top-0 m-3">
                <button onClick={signOut}>Sign Out</button>
            </div>

            <div className="ml-5 mt-80">   
               <MealIdeas ingredient={selectedItemName}/>
            </div>   
        </main>
    );        
}