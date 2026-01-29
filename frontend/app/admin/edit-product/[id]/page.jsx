export default async function EditProductPage({ params }) {
  const { id } = await params;

  // fake existing product
  const product = {
    title: "Floral Cotton Kurti",
    price: 1499,
    category: "kurti",
    description: "Elegant cotton kurti",
  };

  return (
   <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-12">

     <h1 className="text-2xl font-semibold mb-6">
        Edit Product (ID: {id})
      </h1>

      <form className="space-y-4">
        <input
          type="text"
          defaultValue={product.title}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          defaultValue={product.price}
          className="w-full border px-4 py-2 rounded"
        />

        <select
          defaultValue={product.category}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="kurti">Kurti</option>
          <option value="suit">Suit</option>
          <option value="lehenga">Lehenga</option>
          <option value="dupatta">Dupatta</option>
        </select>

        <textarea
          rows="4"
          defaultValue={product.description}
          className="w-full border px-4 py-2 rounded"
        ></textarea>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </main>
  );
}
