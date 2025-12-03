"use client";
import * as client from "../../client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import {
  setModules,
  editModule,
  updateModule,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

/* ---------------------- TYPES (RENAMED TO AVOID CONFLICT) ---------------------- */

interface Lesson {
  _id: string;
  name: string;
}

interface UIModule {
  _id: string;
  name: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
  [key: string]: unknown;
}

/* ---------------------- COMPONENT ---------------------- */

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const reduxModules = useSelector(
    (state: RootState) => state.modulesReducer.modules as UIModule[]
  );

  const [moduleName, setModuleName] = useState("");

  /* ---------------- REMOVE MODULE ---------------- */
 const onRemoveModule = async (moduleId: string) => {
  if (!cid) return;
  await client.deleteModule(cid as string, moduleId);

  dispatch(
    setModules(
      reduxModules.filter((m: UIModule) => m._id !== moduleId)
    )
  );
};


  /* ---------------- UPDATE MODULE ---------------- */
  const onUpdateModule = async (module: UIModule) => {
  if (!cid) return;

  await client.updateModule(cid as string, module);

  const newModules = reduxModules.map((m: UIModule) =>
    m._id === module._id ? module : m
  );

  dispatch(setModules(newModules));
};


  /* ---------------- CREATE MODULE ---------------- */
  const onCreateModuleForCourse = async () => {
    if (!cid || !moduleName.trim()) return;

    const newModule = {
      name: moduleName,
      course: cid as string,
    };

    const created = await client.createModuleForCourse(cid as string, newModule);

    dispatch(setModules([...reduxModules, created]));
    setModuleName("");
  };

  /* ---------------- FETCH MODULES ---------------- */
  const fetchModules = async () => {
    if (!cid) return;

    const serverModules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(serverModules));
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  /* ---------------- UI ---------------- */
  return (
    <div className="wd-modules">
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={onCreateModuleForCourse}
      />

      <br /><br /><br />

      <ListGroup id="wd-modules" className="rounded-0">
        {reduxModules.map((module: UIModule) => (
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
                  defaultValue={module.name}
                  onChange={(e) =>
                    dispatch(
                      updateModule({
                        ...module,
                        name: e.target.value,
                        lessons: module.lessons ?? [],
                      })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({
                        ...module,
                        editing: false,
                        lessons: module.lessons ?? [],
                      });
                    }
                  }}
                />
              )}

              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => onRemoveModule(moduleId)}
                editModule={(id) => dispatch(editModule(id))}
              />
            </div>

            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson) => (
                  <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
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
