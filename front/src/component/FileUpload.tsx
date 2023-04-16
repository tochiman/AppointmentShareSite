import React, { useState, useCallback } from 'react';
import { DropzoneAreaBase, FileWithPath } from 'react-dropzone';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropzone: {
      border: `2px dashed ${theme.palette.secondary.main}`,
      borderRadius: theme.shape.borderRadius,
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.8,
      },
    },
    icon: {
      fontSize: 40,
      marginBottom: theme.spacing(1),
    },
    files: {
      marginTop: theme.spacing(2),
    },
    file: {
      marginTop: theme.spacing(1),
    },
  })
);

const FileUpload: React.FC = () => {
  const classes = useStyles();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const handleDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    [setFiles]
  );

  const handleDelete = useCallback(
    (index: number) => {
      setFiles((prevFiles) => prevFiles.filter((f, i) => i !== index));
    },
    [setFiles]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DropzoneAreaBase
          acceptedFiles={['image/*', 'video/*', 'audio/*']}
          filesLimit={10}
          maxFileSize={5000000}
          onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
          multiple
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className={classes.dropzone}>
              <input {...getInputProps()} />
              <AddCircleIcon className={classes.icon} />
              <Typography>Drag and drop files here or click to select</Typography>
            </div>
          )}
        </DropzoneAreaBase>
      </Grid>
      <Grid item xs={12} className={classes.files}>
        {files.map((file, index) => (
          <div key={index} className={classes.file}>
            <Typography>{file.name}</Typography>
            <Typography variant="caption">{file.size} bytes</Typography>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default FileUpload;
