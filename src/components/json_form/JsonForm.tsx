import { useContext, useState } from 'react';
import './jsonForm.css'
import { Editor } from '@monaco-editor/react';
import { MarkerSeverity, editor } from 'monaco-editor';
import axios from 'axios';
import { StateContext } from '../../services/states/state.context';

interface JsonFormProps {

}
export function JsonForm({ }: JsonFormProps) {

    const initialText = 'Write your JSON code here';
    const [text, setText] = useState<string>(initialText);
    const [isValid, setIsValid] = useState<boolean>(false);

    const { submit } = useContext(StateContext)!;

    const handleEditorChange = (newText: string = '') => {
        setText(newText);
    };

    const handleValidate = (markers: editor.IMarker[]) => {
        const hasError = markers.some((marker) => marker.severity === MarkerSeverity.Error);
        setIsValid(!hasError);
    };

    const handleClearClick = () => {
        setText(initialText);
    };

    const handleSubmitClick = async () => {
        if (!isValid) {
            console.error('O código contém erros. Corrija-os antes de enviar.');
            return;
        }

        try {
            submit(text);
            //const response = await axios.post('http://localhost:5000/receive_json', { text });
            // await handleGetStates();
        } catch (error) {
            console.error('Erro ao enviar texto:', error);
        }
    };

    // const handleGetStates = async () => {
    //     try {
    //         const statesResponse = await axios.get('http://localhost:5000/get_states');
    //         const data: State[] = statesResponse.data.states;
    //         setStates(data);
    //     } catch (error) {
    //         console.error('Erro ao obter estados:', error);
    //     }
    // };

    return (
        <div className='form-container'>
            <Editor
                className={`editor ${isValid ? 'valid' : 'invalid'}`}
                height='75%'
                width='100%'
                theme='vs-dark'
                defaultLanguage='json'
                value={text}
                onChange={handleEditorChange}
                onValidate={handleValidate}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    lineNumbersMinChars: 1,
                    overviewRulerBorder: false,
                    scrollbar: {
                        horizontal: 'hidden',
                        verticalScrollbarSize: 5
                    },
                    mouseWheelZoom: true,
                    lineHeight: 1.4,
                    cursorWidth: 1,
                    wordWrap: 'on',
                    glyphMargin: true,
                    folding: true,
                    lineDecorationsWidth: 10,
                    matchBrackets: 'near',
                    renderLineHighlight: 'gutter',
                }}
            />
            <div className='btn-container'>
                <button className='btn-form' onClick={handleClearClick}>Clear</button>
                <button className='btn-form' onClick={handleSubmitClick}>Submit</button>
            </div>
        </div>
    )
}