export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of your web application running on netlify. The landing should include the following : Your full name and section links to each of thr lab assignments, link to the kanbas application
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
            </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
                <option value="ASSIGNMNETS">ASSIGNMENTS</option>
            </select>
            </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grades as</label>
          </td>
          <td>
            <select id="wd-display-grade-as">
                <option value="Percentage">Percentage</option>
            </select>
            </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type">
                <option value="Online">Online</option>
            </select>
            <p>Online entry option</p>
            <input type="checkbox" name="text" id="wd-text-entry"/>
            <label htmlFor="Text-entry">Text Entry</label><br/>

            <input type="checkbox" name="website-url" id="wd-website-url"/>
            <label htmlFor="website-url">Website URL</label><br/>

            <input type="checkbox" name="media-recordings" id="wd-media-recordings"/>
            <label htmlFor="media-recordings">Media Recordings</label><br/>

            <input type="checkbox" name="student-annotation" id="wd-student-annotation"/>
            <label htmlFor="student-annotation">Student Annotation</label><br/>

            <input type="checkbox" name="file-upload" id="wd-file-upload"/>
            <label htmlFor="file-upload">File Upload</label><br/>
            </td>
        </tr>


        <tr>
          <td align="right" valign="top">
            <label htmlFor="Assign">Assign to</label>
          </td>
          <td>
            <input id="wd-assign-to" defaultValue="Everyone" />
            </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="Due">Due</label>
          </td>
          <td>
            <input defaultValue="2020-10-15" type="date" id="wd-due-date" /><br/>
            </td>
        </tr>


        <tr>
          <td align="right" valign="top">
            <label htmlFor="available-from">Availabe from</label>
          </td>
          <td>
            <input defaultValue="2025-10-10" type="date" id="wd-available-from" /><br/>
            </td>

            <td align="right" valign="top">
            <label htmlFor="Until">Until</label>
          </td>
          <td>
            <input defaultValue="2025-10-20" type="date" id="wd-available-until" /><br/>
            </td>
        </tr>

        <tr>
          <td align="right" valign="top" colSpan = {4}>
            <button>cancel</button>  <button>Save</button>
          </td>
        </tr>


      </table>
    </div>
);}
