import { useContext, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import { get, ref } from "firebase/database";
import { database } from "../Firebase/Firebase";

const useProjectsDB = () => {
    //get firebase realtime database
    const {projects, setProjects} = useContext(AppContext);

    useEffect(() => {
        if (!projects.length) {
            const dbRef = ref(database);
            get(dbRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                const result = snapshot
                    .val()
                    .map((item) => ({ ...item, playVideoState: false }));
                setProjects(result);
                } else {
                console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [projects.length])
}

export default useProjectsDB;