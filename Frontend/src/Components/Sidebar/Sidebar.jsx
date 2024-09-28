import React from 'react'

const Sidebar = () => {
    return (

        <div className="w-64 bg-gray-800 text-white h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
            <ul>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded">Option 1</a>
                </li>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded">Option 2</a>
                </li>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded">Option 3</a>
                </li>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded">Option 4</a>
                </li>
            </ul>
        </div>

    )
}

export default Sidebar