### Setting Up Work Environment (Working on Linux)




---




#### Step 1: Run the CPP Server on Your Computer 
1. Clone the CPP Server from Git (Production Part 4 Branch), or download it as Zip file and extract it.
   
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

2. Clone the JS server repository from Git (production part 4 branch), or download it as Zip file and extract it:
   
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
   
  ![Screenshot at 2024-05-22 18-06-39](https://github.com/EitanMaimoni/project-one-server/assets/155370325/1209ee0f-c204-4712-b34d-b660f0e1a390)


7. Open your web browser and go to [http://localhost:12345](http://localhost:12345). The web app should be running.
   
   ![Screenshot at 2024-05-22 18-09-12](https://github.com/EitanMaimoni/project-one-server/assets/155370325/d1d559ef-c1f5-433b-a81c-c747cd6cdc30)




---




#### Step 3: Run the Android App
1. Clone the Android app repository from Git (production part 4 branch), or download it as a Zip file and extract it:

2. Open Android Studio on your computer.

3. Import the cloned Android app project into Android Studio.

4. Set up an emulator or connect a smartphone of your choice to run the app.

5. Build and run the app using Android Studio.

![צילום מסך 2024-04-21 194050](https://github.com/EitanMaimoni/server/assets/118337931/46ea333c-b3d4-450b-92ff-1b694c00bfe7)



