import Link from 'next/link'

export default function MainComponent() {
  return (
    <div className="mx-auto w-1/2 text-center">
      <div className="mx-auto w-1/2">
        <h1 className='text-xl'>
          MultiSafe
        </h1>
        <h3>The most secure wallet in crypto.</h3>
      </div>

      <div className="mx-auto w-1/4 mt-5">
        <Link href="/create-wallet">
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <p>Create New Wallet</p>
          </div>
        </Link>
      </div>

      <div className="mx-auto w-1/4 mt-5">
        <Link href="/my-wallets">
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <p>My Wallets</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
