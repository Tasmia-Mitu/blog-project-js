document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();

  const form = document.getElementById("create-post");
  form.addEventListener("submit", (evt) => createBlogPost(evt));
});

async function fetchUsers() {
  const blogContainer = document.getElementById("blog-container");
  blogContainer.innerHTML = `<p class="text-blue-500">Loading blog posts...</p>`;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const blogs = await response.json();

    blogContainer.innerHTML = "";

    blogContainer.classList.add(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "gap-6",
      "p-5"
    );

    blogs.slice(0, 15).forEach((blog) => {
      displayBlogPost(blog.id, blog.title, blog.body, blogContainer);
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    blogContainer.innerHTML = `<p class="text-red-500">Faild to load blog posts.</p>`;
  }
}

// create a new blog post-----
async function createBlogPost(evt) {
  evt.preventDefault();

  const title = document.getElementById("blog-title").value;
  const description = document.getElementById("blog-description").value;

  if(!title || !description){
    Swal.fire({
      icon: "warning",
      title: "Missing Fields!",
      text: "Please enter both title & description",
    });
    return;
  }

  const newPost = {
    title: title,
    body: description,
    userId: 1,
  };

  try{
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(newPost),
    });

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    Swal.fire({
      icon: "success",
      title: "Blog Created!",
      text: "Your new blog post has been added.",
    });

    const blogContainer = document.getElementById("blog-container");
    displayBlogPost(data.id, data.title, data.body, blogContainer, true);

    // resset form
    document.getElementById("create-post").reset();

  } catch(error){
    console.error("Error creating blog post:", error);
    Swal.fire({
      icon: "error",
      title: "Failed!",
      text: "Could not craete the blog post.",
    });
  }
  
}

// display blog post----
function displayBlogPost(id, title, body, container, prepend = true) {
  const blogPost = document.createElement("div");
  blogPost.classList.add(
    "bg-white",
    "shadow-lg",
    "rounded-lg",
    "overflow-hidden",
    "transition",
    "transform",
    "hover:scale-105",
    "duration-300",
    "p-4"
  );
  blogPost.setAttribute("data-id", id);

  const titleElement = document.createElement("h2");
  titleElement.classList.add("text-xl", "font-semibold", "text-gray-800");
  titleElement.textContent = title;

  const bodyElement = document.createElement("p");
  bodyElement.classList.add("mt-2", "text-sm", "text-gray-600");
  bodyElement.textContent = body;

  // delete button....
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("bg-red-500", "text-white", "px-3", "py-1", "rounded", "mt-2");
  deleteButton.onclick = () => deleteBlogPost(id, blogPost);

  // edit button--
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("bg-blue-500", "text-white", "px-3", "py-1", "rounded", "mt-2", "ml-2");
  editButton.onclick = () => editBlogPost(id, title, body, blogPost);

  blogPost.appendChild(titleElement);
  blogPost.appendChild(bodyElement);
  blogPost.appendChild(deleteButton);
  blogPost.appendChild(editButton);

  if (prepend) {
    container.prepend(blogPost);
  } else {
    container.appendChild(blogPost);
  }
}

async function deleteBlogPost(id, blogPost){
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });

    if(!response.ok){
      throw new Error("Failed to delete blog post");
    }

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "The blog post has been deleted.",
    });

    blogPost.remove();
  } catch(error){
    console.error("Error deleting blog post:", error);
    Swal.fire({
      icon: "error",
      title: "Failed!",
      text: "Could not delete the blog post.",
    });
  }
}

async function editBlogPost(id, oldTitle, oldBody, blogPost) {
  const newTitle = prompt("Enter new title:", oldTitle);
  const newBody = prompt("Enter new description:", oldBody);

  if (!newTitle || !newBody) return;

  try {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, body: newBody, userId: 1 }),
    });

    alert("Blog post updated successfully!"); // Simple Success Message

    // **UI Update ✅**
    blogPost.querySelector("h2").textContent = newTitle;
    blogPost.querySelector("p").textContent = newBody;
  } catch (error) {
    alert("Failed to update the blog post."); // Error Message
  }
}


