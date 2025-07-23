import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import CustomLoader from "../../Components/resusable/CustomLoader"

const CustomQuillEditor = ({ value, onChange, onBlur }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <CustomLoader height={60} width={60} color="#0d6efd" message="Loading editor..." />
        </div>
      )}

      <Editor
        apiKey="l96zxxvhqbsyques3e3eyv4dwseu31zgkqxu44h3lkz55cco"
        value={value}
        onEditorChange={onChange}
        onBlur={onBlur}
        onInit={() => setLoading(false)}
        init={{
          height: 300,
          menubar: false,
          statusbar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "autoresize",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "removeformat | help | code",
          toolbar_mode: "wrap",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
};

export default CustomQuillEditor;
