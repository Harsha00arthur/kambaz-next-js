"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap"; 
import { BsGripVertical } from "react-icons/bs";
import * as db from "../../../Database";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

interface Lesson {
  _id: string;
  name: string;
}

interface Module {
  _id: string;
  name: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean; 
}

export default function Modules() {
  const { cid } = useParams();

  const [modules, setModules] = useState<Module[]>(
    db.modules.filter((module) => module.course === cid)
  );

  const [moduleName, setModuleName] = useState<string>("");

  const addModuleLocal = () => {
    if (!moduleName.trim()) return;
    const newModule: Module = {
      _id: uuidv4(),
      name: moduleName,
      course: cid as string, 
      lessons: [],
    };
    setModules([...modules, newModule]);
    setModuleName("");
  };

  const deleteModuleLocal = (moduleId: string) => {
    setModules(modules.filter((m) => m._id !== moduleId));
  };

  const editModuleLocal = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m
      )
    );
  };

  const updateModuleLocal = (module: Module) => {
    setModules(
      modules.map((m) =>
        m._id === module._id ? module : m
      )
    );
  };

  const { modules: reduxModules } = useSelector((state: RootState) => state.modulesReducer);

  const dispatch = useDispatch();

  return (
    <div className="wd-modules">
      <ModulesControls 
        moduleName={moduleName} 
        setModuleName={setModuleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid as string })); // ✅ FIX 1 used here too
          setModuleName("");
        }} 
      />

      <br />
      <br />
      <br />

      <ListGroup id="wd-modules" className="rounded-0">
        {reduxModules.map((module) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}

              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(
                      updateModule({
                        ...module,
                        name: e.target.value,
                        lessons: module.lessons ?? [], // ✅ FIX 2: ensure lessons is always an array
                      })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(
                        updateModule({
                          ...module,
                          editing: false,
                          lessons: module.lessons ?? [], // ✅ FIX 2 repeated
                        })
                      );
                    }
                  }}
                  defaultValue={module.name}
                />
              )}

              <ModuleControlButtons 
                moduleId={module._id}
                deleteModule={(moduleId) => dispatch(deleteModule(moduleId))}
                editModule={(moduleId) => dispatch(editModule(moduleId))} 
              />
            </div>

            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson) => (
                  <ListGroupItem
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                    <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
