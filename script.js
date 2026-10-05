// 1. YOUR CREDENTIALS
// Replace these strings with your actual Project URL and anon key from Step 1
const SUPABASE_URL = "https://vauydhabannqaglhbakn.supabase.co/rest/v1/reviews"; 
const SUPABASE_KEY = "sb_publishable_zxo1TfKv2yR7kKvsegRsiw_h9pmt_8R"; 

// 2. CONNECT TO SUPABASE
// This initializes the Supabase client library so your site can talk to your database
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. LISTEN FOR FORM SUBMISSIONS
// Find the form element in index.html by its ID
const form = document.getElementById("reviewForm");

form.addEventListener("submit", async (e) => {
  // Prevent the default browser behavior (reloading the page on form submit)
  e.preventDefault();

  // Grab the values typed/checked by the user in the form inputs
  const name = document.getElementById("restaurantName").value;
  const rating = document.getElementById("rating").value;
  const fryer = document.getElementById("dedicatedFryer").checked;
  const comments = document.getElementById("comments").value;

  // Send the gathered data into your 'reviews' table in Supabase
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      { 
        restaurant_name: name, 
        safety_rating: rating, 
        has_dedicated_fryer: fryer, 
        comments: comments 
      }
    ]);

  if (error) {
    console.error("Error inserting review:", error);
    alert("Something went wrong saving your review. Check the console!");
  } else {
    alert("Review saved successfully!");
    form.reset(); // Clear the form input fields
    fetchAndDisplayReviews(); // Refresh the visible review list on screen
  }
});

// 4. FETCH AND DISPLAY REVIEWS
// This function asks Supabase for all reviews and draws them as cards on the screen
async function fetchAndDisplayReviews() {
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false }); // Newest reviews show at the top

  if (error) {
    console.error("Error fetching reviews:", error);
    return;
  }

  // Find the container <div> in index.html where reviews belong
  const listContainer = document.getElementById("reviewsList");
  listContainer.innerHTML = ""; // Clear out old cards before drawing updated ones

  // Loop through every review row fetched from Supabase
  reviews.forEach((review) => {
    // Create a new HTML <div> element for this review card
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.margin = "10px 0";
    card.style.borderRadius = "8px";

    // Fill the card with the review details
    card.innerHTML = `
      <h3>${review.restaurant_name}</h3>
      <p><strong>Safety Rating:</strong> ${review.safety_rating} / 5 ⭐</p>
      <p><strong>Dedicated Fryer:</strong> ${review.has_dedicated_fryer ? "Yes ✅" : "No ❌"}</p>
      <p>${review.comments}</p>
    `;

    // Append the newly created card into the container
    listContainer.appendChild(card);
  });
}

// 5. INITIAL LOAD
// Run this as soon as the page opens so existing reviews show up right away
fetchAndDisplayReviews();