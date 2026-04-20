export default function Login() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Login Page</h1>

      <input
        type="email"
        placeholder="Enter email"
        className="border p-2 mt-4 block"
      />

      <input
        type="password"
        placeholder="Enter password"
        className="border p-2 mt-2 block"
      />

      <button className="bg-black text-white px-4 py-2 mt-4">
        Login
      </button>
    </div>
  );
}