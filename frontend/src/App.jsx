
import "./App.css";
import { useState, useRef, useEffect } from "react";

const bookSearchCache = {};

function App() {
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendBooks, setBackendBooks] = useState([]);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState("");
  const fetchBackendBooks = async () => {
  try {
    setBackendLoading(true);
    const response = await fetch("http://localhost:5000/api/books");

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();
    setBackendError("");

        setBackendBooks(data);
  } catch (error) {
  console.error("Backend error:", error);
  setBackendError("Unable to load featured books.");
}
  finally {
    setBackendLoading(false);
  }
};
useEffect(() => {
  fetchBackendBooks();
}, []);
  const searchController = useRef(null);

  const [cartItems, setCartItems] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("bookhaven-cart")) || [];
  } catch {
    return [];
  }
});

const [showCart, setShowCart] = useState(false);
const [showCheckout, setShowCheckout] = useState(false);
const [orderPlaced, setOrderPlaced] = useState(false);
const [paymentMethod, setPaymentMethod] = useState("card");
const [cartMessage, setCartMessage] = useState("");
const [showCollection, setShowCollection] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);

const addToCart = (book) => {
  const itemId = String(book.id ?? book._id ?? book.key);

  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) => String(item.id) === itemId
    );

    if (existingItem) {
      return currentItems.map((item) =>
        String(item.id) === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...currentItems,
      {
        id: itemId,
        title: book.title,
        author: book.author || book.author_name?.join(", ") || "Author unknown",
        price: Number(book.price) || 299,
        cover:
          book.cover ||
          (book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : ""),
        quantity: 1,
      },
    ];
  });

  setCartMessage(`${book.title} added to your bag.`);
};
const openBookDetails = async (book) => {
  if (book._id) {
    try {
      const response = await fetch(
  `https://bookhaven-jdxh.onrender.com/api/books/${book._id}`
);

      if (!response.ok) {
        throw new Error("Failed to fetch book details");
      }

      const data = await response.json();

      setSelectedBook(data);
      return;
    } catch (error) {
      console.error("Failed to load book details:", error);
    }
  }

  setSelectedBook(book);
};

const updateQuantity = (id, change) => {
  setCartItems((items) =>
    items
      .map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};

const removeFromCart = (id) => {
  setCartItems((items) =>
    items.filter((item) => String(item.id) !== String(id))
  );
};

const cartCount = cartItems.reduce(
  (total, item) => total + item.quantity,
  0
);

const cartTotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

  
async function searchBooks(eventOrTerm) {
  if (eventOrTerm && typeof eventOrTerm.preventDefault === "function") {
    eventOrTerm.preventDefault();
  }

  if (typeof eventOrTerm !== "string") {
  setShowCollection(false);
}
  const searchTerm =
    typeof eventOrTerm === "string"
      ? eventOrTerm.trim()
      : query.trim();

  if (!searchTerm) {
    setResults([]);
    setError("Please enter a book title or author.");
    return;
  }

  setResults([]);
  setLoading(true);
  setError("");

  try {
    const cacheKey = searchTerm.toLowerCase();
    const cached = bookSearchCache[cacheKey];

    if (cached) {
      setResults(cached);
      return;
    }

    if (searchController.current) {
      searchController.current.abort();
    }

    const controller = new AbortController();
    searchController.current = controller;

    const url =
      `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}` +
      `&limit=8&fields=key,title,author_name,first_publish_year,cover_i`;

    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Book search is temporarily unavailable. Try again.");
    }

    const data = await response.json();
    const foundBooks = data.docs || [];

    bookSearchCache[cacheKey] = foundBooks;
    setResults(foundBooks);

    if (foundBooks.length === 0) {
      setError("No books found. Try another title or author.");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      setError(err.message || "Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
}
useEffect(() => {
  localStorage.setItem("bookhaven-cart", JSON.stringify(cartItems));
}, [cartItems]);


  return (
  <div className="app">

    {showCart && (
  <div className="cart-overlay" onClick={() => setShowCart(false)}>
    <section
      className="cart-panel"
      onClick={(event) => event.stopPropagation()}
      aria-label="Shopping bag"
    >
      <div className="cart-header">
        <div>
          <p className="eyebrow">YOUR BOOKHAVEN BAG</p>
          <h2>Your <em>bag.</em></h2>
          <p>{cartCount} {cartCount === 1 ? "book" : "books"} in your bag</p>
        </div>

        <button
          className="cart-close"
          onClick={() => setShowCart(false)}
          aria-label="Close cart"
        >
          ×
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your bag is waiting for a good story.</p>
          <button
            className="cart-continue"
            onClick={() => setShowCart(false)}
          >
            Continue browsing ↗
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                {item.cover ? (
                  <img src={item.cover} alt={item.title} />
                ) : (
                  <div className="cart-no-cover">BookHaven</div>
                )}

                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <strong>
                    ₹{item.price.toLocaleString("en-IN")}
                  </strong>

                  <div className="quantity-control">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.title} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase ${item.title} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <strong className="cart-subtotal">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <strong>
                ₹{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <p>Shipping and taxes calculated at checkout.</p>

            <button
  className="cart-checkout"
  onClick={() => {
    setShowCart(false);
    setShowCheckout(true);
  }}
>
  Checkout
</button>

            <button
              className="cart-continue"
              onClick={() => setShowCart(false)}
            >
              Continue shopping
            </button>
          </div>
        </>
      )}
    </section>
  </div>
)}

{showCheckout && (
  <section className="checkout-section">
    {!orderPlaced ? (
      <>
        <button
          className="details-back"
          type="button"
          onClick={() => setShowCheckout(false)}
        >
          ← Back to bag
        </button>

        <div className="checkout-layout">
          <div className="checkout-form">
  <p className="eyebrow">BOOKHAVEN CHECKOUT</p>

  <h2>Complete your order</h2>

  <form
    onSubmit={(event) => {
      event.preventDefault();
      setOrderPlaced(true);
      setCartItems([]);
    }}
  >
    <h3>Contact details</h3>

    <label>
      Full name
      <input
        type="text"
        placeholder="Your full name"
        required
      />
    </label>

    <label>
      Email address
      <input
        type="email"
        placeholder="you@example.com"
        required
      />
    </label>

    <label>
      Phone number
      <input
        type="tel"
        placeholder="Your phone number"
        required
      />
    </label>

    <h3>Delivery address</h3>

    <label>
      Address
      <textarea
        placeholder="House number, street and area"
        rows="3"
        required
      ></textarea>
    </label>

    <div className="checkout-row">
      <label>
        City
        <input
          type="text"
          placeholder="Mumbai"
          required
        />
      </label>

      <label>
        PIN code
        <input
          type="text"
          placeholder="400001"
          required
        />
      </label>
    </div>

    <h3>Payment method</h3>

<div className="payment-options">
  <label className="payment-option">
    <input
      type="radio"
      name="payment"
      value="card"
      checked={paymentMethod === "card"}
      onChange={() => setPaymentMethod("card")}
    />
    <span>💳 Card</span>
  </label>

  <label className="payment-option">
    <input
      type="radio"
      name="payment"
      value="upi"
      checked={paymentMethod === "upi"}
      onChange={() => setPaymentMethod("upi")}
    />
    <span>📱 UPI</span>
  </label>

  <label className="payment-option">
    <input
      type="radio"
      name="payment"
      value="cod"
      checked={paymentMethod === "cod"}
      onChange={() => setPaymentMethod("cod")}
    />
    <span>💵 Cash on Delivery</span>
  </label>
</div>

{paymentMethod === "card" && (
  <div className="payment-fields">
    <label>
      Cardholder name
      <input
        type="text"
        placeholder="Name on card"
        required
      />
    </label>

    <label>
      Card number
      <input
        type="text"
        placeholder="1234 5678 9012 3456"
        maxLength="19"
        required
      />
    </label>

    <div className="checkout-row">
      <label>
        Expiry date
        <input
          type="text"
          placeholder="MM/YY"
          maxLength="5"
          required
        />
      </label>

      <label>
        CVV
        <input
          type="password"
          placeholder="123"
          maxLength="3"
          required
        />
      </label>
    </div>
  </div>
)}

{paymentMethod === "upi" && (
  <div className="payment-fields">
    <label>
      UPI ID
      <input
        type="text"
        placeholder="yourname@upi"
        required
      />
    </label>
  </div>
)}

<p className="payment-note">
  Demo checkout only — no real payment is processed.
</p>

    <button type="submit" className="cart-checkout">
      Place order · ₹{cartTotal.toLocaleString("en-IN")}
    </button>
  </form>
</div>

          <div className="checkout-summary">
            <p className="eyebrow">ORDER SUMMARY</p>

            <h3>Your BookHaven order</h3>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <strong>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <div className="checkout-total">
              <span>Total</span>
              <strong>
                ₹{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="order-success">
        <p className="eyebrow">ORDER CONFIRMED</p>

        <h2>Thank you for your order! ✦</h2>

        <p>
          Your BookHaven order has been placed successfully.
          We'll take care of the rest.
        </p>

        <button
          className="cart-continue"
          type="button"
          onClick={() => {
            setOrderPlaced(false);
            setShowCheckout(false);
          }}
        >
          Continue shopping
        </button>
      </div>
    )}
  </section>
)}

      <div className="announcement">
        A GOOD BOOK. A QUIET EVENING. A LITTLE MAGIC.
      </div>

      <header className="navbar">
        <a className="logo" href="#home">
          book<span>haven.</span>
        </a>

        <nav className="nav-links">
          <a className="active" href="#home">Home</a>
          <a href="#bestsellers">Shop</a>
          <a href="#about">Our Story</a>
        </nav>

        <div className="nav-actions">
          <a href="#bestsellers" aria-label="Search books">⌕</a>
          <button
  type="button"
  className="nav-bag"
  onClick={() => setShowCart(true)}
>
  Bag ({cartCount})
</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
            <h1>
              Stories worth
              <br />
              <em>staying up for.</em>
            </h1>

            <p className="hero-description">
              Thoughtfully chosen books for curious minds,
              slow mornings and everything in between.
            </p>

            
  
<form className="search-form" onSubmit={searchBooks}>
  <span className="search-icon" aria-hidden="true">⌕</span>

  <input
    type="text"
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    placeholder="Find your next favourite book..."
    aria-label="Search books"
  />

  {query && (
    <button
      type="button"
      className="search-reset"
      aria-label="Clear search text"
      onClick={() => {
        setQuery("");
        setError("");
        setResults([]);
      }}
    >
      ×
    </button>
  )}

  <button className="search-submit" type="submit" disabled={loading}>
    {loading ? "Searching…" : "Explore"}
    {!loading && <span aria-hidden="true"> ↗</span>}
  </button>
</form>


            <a href="#bestsellers" className="primary-button">
              Explore the collection <span>↗</span>
            </a>

            <div className="hero-note">
              <span className="note-line" />
              A little world between the pages.
            </div>
          </div>

          <div className="hero-art">
            <div className="art-circle" />
            <div className="art-caption">THE ART OF SLOW LIVING · NO. 001</div>
            <img
              className="hero-book"
              src="https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg"
              alt="Featured book cover"
            />
            <div className="floating-note">
              <span>Currently reading</span>
              <strong>Something wonderful.</strong>
            </div>
          </div>
        </section>

        
  {(results.length > 0 || loading || error || selectedBook) && (
    <section className="live-results" id="live-results">
      {selectedBook && (
  <section className="book-details" id="book-details">
    <button
      className="details-back"
      type="button"
      onClick={() => setSelectedBook(null)}
    >
      ← Back to books
    </button>

    <div className="details-layout">
      <div className="details-cover">
        <img
          src={
            selectedBook.cover ||
            (selectedBook.cover_i
              ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
              : "")
          }
          alt={`Cover of ${selectedBook.title}`}
        />
      </div>

      <div className="details-info">
        <p className="eyebrow">BOOKHAVEN EDITION</p>

        <h2>{selectedBook.title}</h2>

        <p className="details-author">
          {selectedBook.author ||
            selectedBook.author_name?.join(", ") ||
            "Author unknown"}
        </p>

        <p className="details-price">
          ₹{selectedBook.price || 299}
        </p>

        <p className="details-description">
          A good book has a way of meeting you exactly where you are.
          Take your time, settle in, and discover your next favourite read.
        </p>

        <button
  className="details-add"
  type="button"
  onClick={() => addToCart(selectedBook)}
>
  {cartMessage.includes(selectedBook.title)
    ? "✓ Added to bag!"
    : "Add to bag +"}
</button>
      </div>
    </div>
  </section>
)}
      <div className="section-heading">
        <div>
          <p className="eyebrow">
  {showCollection ? "BOOKHAVEN COLLECTION" : "DISCOVER SOMETHING NEW"}
</p>

<h2>
  {showCollection ? (
    <>
      Books worth <em>making time for.</em>
    </>
  ) : (
    <>
      Search <em>results.</em>
    </>
  )}
</h2>
        </div>

        
      </div>

      {loading && (
  <p className="search-message" role="status">
    <span className="loading-dot" />
    Finding your next read...
  </p>
)}

      {error && <p className="search-message">{error}</p>}

{showCollection && (
  <p className="collection-label">CURATED FOR YOU</p>
)}

<div className="book-grid">
        {results.map((book) => (
          <article className="book-card" key={book.key}>
            <div className="book-image">
              <span className="book-category">
                {book.first_publish_year || "BOOK"}
              </span>

              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                  alt={`Cover of ${book.title}`}
                  loading="lazy"
                />
              ) : (
                <div className="no-cover">BookHaven</div>
              )}
            </div>

            <div className="book-info">
              <div>
                <h3>{book.title}</h3>
                <p>
                  {book.author_name?.join(", ") || "Author unknown"}
                </p>
              </div>
            </div>

            
<button
  className="result-link featured-details"
  type="button"
  onClick={() =>
    openBookDetails({
      ...book,
      price: 299,
    })
  }
>
  View book details ↗
</button>

            
<button
  className="quick-add search-add"
  type="button"
  onClick={() =>
    addToCart({
      key: book.key,
      title: book.title,
      author: book.author_name?.join(", ") || "Author unknown",
      price: 299,
      cover_i: book.cover_i,
    })
  }
>
  {cartMessage.includes(book.title)
  ? "✓ Added to bag!"
  : "Add to bag +"}
</button>

          </article>
        ))}
      </div>
    </section>
  )}


        <section className="benefits">
          <span>✳ CURATED WITH CARE</span>
          <span>✳ BOOKS FOR EVERY MOOD</span>
          <span>✳ YOUR NEXT FAVOURITE AWAITS</span>
        </section>

        <section className="collection" id="bestsellers">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW GOOD READS</p>
              <h2>Books to <em>fall into.</em></h2>
            </div>
            <a
  href="#search"
  className="view-collection"
  onClick={() => {
    setShowCollection(true);
  setQuery("bestselling books");
  searchBooks("bestselling books");
}}
>
  View collection ↗
</a>
          </div>

          <div className="book-grid">
  {backendLoading ? (
  <p>Loading featured books...</p>
) : backendError ? (
  <div className="books-message">
    <p>{backendError}</p>
    <button type="button" onClick={fetchBackendBooks}>
      Try again
    </button>
  </div>
) : backendBooks.length === 0 ? (
  <p className="books-message">
    No featured books available right now.
  </p>
) : (
  backendBooks.map((book) => (
              <article className="book-card" key={book._id}>
                <div className="book-image">
                  <span className="book-category">{book.category}</span>
                  <img src={book.cover} alt={book.title} />
                  
<button
  className="quick-add"
  type="button"
  onClick={() => addToCart(book)}
>
  {cartMessage.includes(book.title)
  ? "✓ Added to bag!"
  : "Add to bag +"}
</button>

                </div>

                
<div className="book-info">
  <div>
    <h3>{book.title}</h3>
    <p>{book.author}</p>
  </div>
  <strong>₹{book.price}</strong>
</div>

<button
  className="featured-details"
  type="button"
  onClick={() => openBookDetails(book)}
>
  View book details ↗
</button>

    </article>
  ))
  )}
</div>
        </section>

        <section className="story" id="about">
          <div className="story-mark">b.</div>
          <div>
            <p className="eyebrow">MORE THAN JUST BOOKS</p>
            <h2>A slower kind of <em>scrolling.</em></h2>
            <p>
              Less noise, more stories. Find the book that meets you
              where you are and takes you somewhere new.
            </p>
          </div>
          <a href="#bestsellers" className="story-link">
            Find your next read ↗
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">book<span>haven.</span></a>
        <p>Made for the love of reading.</p>
        <span>© 2026 BookHaven</span>
      </footer>
    </div>
  );
}

export default App;
