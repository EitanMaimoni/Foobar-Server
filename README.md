# Full-Stack Facebook Clone

This project is a full-stack clone of Facebook, developed using **React** for the frontend, **Node.js** for the backend, and **MongoDB** for the database. The application is designed to provide a Facebook-like experience with features such as user authentication, post creation, and friend requests. 

https://github.com/user-attachments/assets/beb34895-aee3-46b7-b86b-79b700e13c28

## Features

- **User Authentication**: Secure login and signup system using JWT tokens.
- **Profile Management**: Users can update their profile, upload pictures, and manage privacy settings.
- **Post Creation & Interaction**: Users can create posts, like, comment, and share posts.
- **Friend Requests**: Send, accept, or reject friend requests.
- **Real-time Updates**: Post notifications and live updates using WebSockets.

## Tech Stack

- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Performance**: C++ for performance-critical operations

---

## Running the Project Locally (Working on Linux)


#### Step 1: Run the CPP Server on Your Computer 
1. Clone the CPP Server from Git or download it as Zip file and extract it.
``` bash
git clone https://github.com/EitanMaimoni/BloomFilter.git
```   
![Screenshot at 2024-05-22 17-46-26](https://github.com/EitanMaimoni/project-one-server/assets/155370325/7df8ed29-b9a4-4a63-b1c9-292153a8142e)

2. Open your terminal (on your IDE)

3. Ensure you have the latest version of Node.js installed. You can check the version using:
   ```bash
   node -v
   ```

4. Create a build directory and navigate into it:
   ```bash
   mkdir build
   cd build
   ```

5. Generate the makefiles using CMake:
   ```bash
   cmake ..
   ```

6. Compile the project:
   ```bash
   make
   ```

7. Run the server:
   ```bash
   ./BloomFilter
   ```
   ![Screenshot at 2024-05-22 17-50-57](https://github.com/EitanMaimoni/project-one-server/assets/155370325/420e860c-f951-4c98-be74-c36bf268d6e0)



   
---




#### Step 2: Run the JS Server
1. Ensure MongoDB is installed and running on your computer. 
   If MongoDB is not installed, follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/installation/).

2. Clone the JS server repository from Git or download it as Zip file and extract it.
```bash
git clone https://github.com/EitanMaimoni/Foobar-Server.git
```
   
   ![Screenshot at 2024-05-22 17-56-10](https://github.com/EitanMaimoni/project-one-server/assets/155370325/50d6d5d2-e6c2-491d-aa28-780a17fb9556)

3. Open your terminal (on your IDE)

4. Install the required dependencies:
   ```bash
   npm install
   ```
5. Ensure you have the latest version of Node.js installed. You can check the version using:
   ```bash
   node -v
   ```

6. Start the server:
   ```bash
   npm start
   ```
   
 ![Screenshot at 2024-05-22 18-57-15](https://github.com/EitanMaimoni/project-one-server/assets/155370325/f70c4762-f349-49d1-8611-5ed363ffab16)

7. Open your web browser and go to [http://localhost:12345](http://localhost:12345). The web app should be running.
   
   ![Screenshot at 2024-05-22 18-09-12](https://github.com/EitanMaimoni/project-one-server/assets/155370325/d1d559ef-c1f5-433b-a81c-c747cd6cdc30)
