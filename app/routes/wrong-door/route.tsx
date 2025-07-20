import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
    { title: 'Oops! Not from Moodle' },
    { name: 'description', content: "Looks like you're not coming from Moodle. Naughty naughty!" },
];
export default function OopsNotFromMoodle() {
    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
            <div className='bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg'>
                <h1 className='text-4xl font-bold text-red-500 mb-4'>Oops! 🚫</h1>
                <p className='text-gray-700 text-lg mb-6'>
                    It seems like you tried to enter without Moodle. This place is LTI-only!
                </p>
                <a
                    href={import.meta.env.VITE_MOODLE_URL}
                    className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
                >
                    Go back to Moodle
                </a>
            </div>
        </main>
    );
}
