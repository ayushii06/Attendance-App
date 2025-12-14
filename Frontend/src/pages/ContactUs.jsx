import React from "react";

export default function Example() {
    return (
        <div className="max-w-5xl w-full mx-auto p-10 text-gray-800">
            <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">Reach Out To Us</span>
            <h1 className="text-4xl font-bold text-left mt-4">
                We'd love to Hear From You.
            </h1>
            <p className="text-left mt-4">
                Or just reach out manually to 
                <a href="mailto:support@upasthit.com" className="text-indigo-600 hover:underline"> support@upasthit.com</a>
            </p>
            <div className="grid md:grid-cols-3 mt-16">
                <div>
                    <svg className="text-indigo-500 bg-indigo-500/20 p-2.5 aspect-square rounded-full size-10" width="24"
                        height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21 4.125H3A1.125 1.125 0 0 0 1.875 5.25V18a1.875 1.875 0 0 0 1.875 1.875h16.5A1.875 1.875 0 0 0 22.125 18V5.25A1.125 1.125 0 0 0 21 4.125m-2.892 2.25L12 11.974 5.892 6.375zM4.125 17.625V7.808l7.115 6.522a1.125 1.125 0 0 0 1.52 0l7.115-6.522v9.817z"
                            fill="currentColor" />
                    </svg>
                    <p className="text-lg font-bold mt-2">Email Support</p>
                    <p className="text-gray-500 mt-1 mb-4">Our team can respond in real time.</p>
                    <a href="mailto:support@upasthit.com" className="text-indigo-600 font-semibold">
                        support@upasthit.com
                    </a>
                </div>

                <div>
                    <svg className="text-indigo-500 bg-indigo-500/20 p-2.5 aspect-square rounded-full size-10" width="21"
                        height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m19 13.513-4.415-1.98-.017-.007a1.87 1.87 0 0 0-1.886.243l-2.091 1.781c-1.22-.66-2.478-1.91-3.14-3.113l1.787-2.125q.043-.051.08-.108a1.88 1.88 0 0 0 .148-1.782L7.488 2A1.88 1.88 0 0 0 5.539.89 5.65 5.65 0 0 0 .625 6.5c0 7.651 6.224 13.875 13.875 13.875a5.65 5.65 0 0 0 5.61-4.914A1.88 1.88 0 0 0 19 13.513m-4.5 4.612A11.64 11.64 0 0 1 2.875 6.5a3.4 3.4 0 0 1 2.67-3.332l1.764 3.938-1.796 2.14q-.044.051-.08.108a1.88 1.88 0 0 0-.12 1.841c.883 1.808 2.702 3.615 4.529 4.5a1.88 1.88 0 0 0 1.845-.136q.055-.036.105-.08l2.102-1.787 3.938 1.763a3.4 3.4 0 0 1-3.332 2.67"
                            fill="currentColor" />
                    </svg>
                    <p className="text-lg font-bold mt-2">Call Us Directly</p>
                    <p className="text-gray-500 mt-1 mb-4">Available during working hours.</p>
                    <span className="text-indigo-600 font-semibold">
                      (+91) 1234567890
                    </span>
                </div>
            </div>
        </div>
    );
};