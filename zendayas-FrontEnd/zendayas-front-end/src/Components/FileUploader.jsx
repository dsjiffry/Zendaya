import React, { Component } from 'react'
import {Segment,Header} from "semantic-ui-react"

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';


import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
    FilePondPluginImageExifOrientation, 
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
    );



export default class FileUploader extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          // Set initial files, type 'local' means this is a file
          // that has already been uploaded to the server (see docs)
        //   files: [
        //     {
        //       source: "",
        //       options: {
        //         type: ""
        //       }
        //     }
        //   ]
        // };
            files:[
                
            ]
        }
      }
    
      handleInit() {
        console.log("FilePond instance has initialised", this.pond);
      }
    
      render() {
        return (
          <Segment>
            {/* Pass FilePond properties as attributes */}
            <Header>{this.props.title.toLocaleLowerCase()}</Header>
            <FilePond
              ref={ref => (this.pond = ref)}
              maxFileSize = "1MB"
              files={this.state.files}
              allowMultiple={false}
              acceptedFileTypes = {['image/png','image/jpeg']}
              oninit={() => this.handleInit()}
              onupdatefiles={fileItems => {
                // Set currently active file objects to this.state
                this.setState({
                  files: fileItems.map(fileItem => { return fileItem.file } )
                });
                fileItems.map(fileItem => 
                    this.props.setParentState({...this.props.parentState , [this.props.title] : fileItem.file})
                    )

                
              }}
            />
          </Segment>
        );
      }
}
