let currentPage = 1;
const limit = 8;
const totalPages = 5;

async function fetchBlogs() {
  try {
    const response = await fetch("https://dev.to/api/articles");
    const blogs = await response.json();

    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = "";

    blogContainer.classList.add(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "gap-6",
      "p-5"
    );

    // const isHomePage = window.location.pathname === "/index.html";
    // const blogsToDisplay = isHomePage ? blogs.slice(0, 6) : blogs;

    const start = (currentPage - 1) * limit;
    const end = currentPage * limit;

    blogs.slice(start, end).forEach((blog) => {
      const blogPost = document.createElement("div");
      blogPost.classList.add(
        "bg-white",
        "shadow-lg",
        "rounded-lg",
        "overflow-hidden",
        "transition",
        "transform",
        "hover:scale-105",
        "duration-300"
      );

      blogPost.addEventListener("click", () => {
        window.location.href = `blog-detail.html?id=${blog.id}`;
      });

      const title = document.createElement("h2");
      title.classList.add(
        "text-xl",
        "font-semibold",
        "text-gray-800",
        "px-4",
        "py-2"
      );
      title.textContent = blog.title;

      const body = document.createElement("p");
      body.classList.add("mt-2", "text-sm", "text-gray-600", "px-4", "pb-4");
      body.textContent = blog.description;

      // Image (if exists)
      if (blog.cover_image) {
        const img = document.createElement("img");
        img.classList.add("w-full", "h-48", "object-cover", "rounded-t-lg");
        img.src = blog.cover_image;
        img.alt = "Blog Image";
        blogPost.appendChild(img);
      }

      blogPost.appendChild(title);
      blogPost.appendChild(body);
      blogContainer.appendChild(blogPost);
    });

    document.getElementById("current-page").textContent = currentPage;

    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = currentPage === totalPages;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}
// handle pagination---
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchBlogs();
  }
}
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchBlogs();
  }
}

async function fetchBlogDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  try {
    const response = await fetch(`https://dev.to/api/articles/${blogId}`);
    const blog = await response.json();

    const blogDetail = document.getElementById("blog-detail");
    blogDetail.innerHTML = `
            <h1 class="text-3xl font-bold text-gray-800">${blog.title}</h1>
            <div class="mt-4">
                <img class="w-full h-64 object-cover rounded-lg" src="${blog.cover_image}" alt="Blog Image">
            </div>
            <div class="mt-4 text-lg text-gray-600">
                <p>${blog.body_html}</p>
            </div>
        `;
  } catch (error) {
    console.error("Error fetching blog details:", error);
  }
}

if (window.location.pathname.includes("blog-detail.html")) {
  fetchBlogDetails();
} else {
  fetchBlogs();
}
