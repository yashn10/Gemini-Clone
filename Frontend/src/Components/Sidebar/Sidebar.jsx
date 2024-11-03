import React from 'react'

const Sidebar = ({ setcomponent }) => {

    const data = (value) => {
        setcomponent(value);
    }


    return (

        <div className="w-64 bg-gray-800 text-white h-screen p-6">
            <h2 className="text-2xl font-bold mb-16">Visit Models</h2>
            <ul>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded" onClick={() => data("text")}>Generate Text</a>
                </li>
                <hr></hr>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded" onClick={() => data("audio")}>Audio To Text</a>
                </li>
                <hr></hr>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded" onClick={() => data("llama text")}>LLama Text</a>
                </li>
                <hr></hr>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded" onClick={() => data("stable diffusion")}>Generate Image using SD</a>
                </li>
                <hr></hr>
                <li className="mb-2">
                    <a href="#" className="hover:bg-gray-700 p-2 block rounded" onClick={() => data("black forest")}>Generate Image using BF</a>
                </li>
                <hr></hr>
            </ul>
        </div>

    )
}

export default Sidebar