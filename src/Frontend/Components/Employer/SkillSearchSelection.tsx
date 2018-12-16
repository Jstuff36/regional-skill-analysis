import * as React from 'react';
import { Form, DropdownItemProps, DropdownProps, CheckboxProps, SemanticShorthandItem } from 'semantic-ui-react';
import { SkillCheckBoxOptions } from '../HomePage';
import { HtmlLabelProps } from 'semantic-ui-react/dist/commonjs/generic';

interface OwnProps {
    dropdownOptions: DropdownItemProps[];
    skillCheckBoxOptions: SkillCheckBoxOptions[];
    onCheckboxUpdate: (e: React.MouseEvent<HTMLInputElement>, label: SemanticShorthandItem<HtmlLabelProps>) => void;
    onSearchUpdate: (e: React.SyntheticEvent<HTMLElement>, value: string) => void;
    hideLabel?: boolean;
}

export class SkillSearchSelection extends React.Component<OwnProps> {

    handleSearchSelect = (e: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
        const {onSearchUpdate} = this.props;
        onSearchUpdate(e, value as string);
    }
    
    handleCheckBoxSelection = (e: React.MouseEvent<HTMLInputElement>, { label }: CheckboxProps) => {
        const {onCheckboxUpdate} = this.props;
        onCheckboxUpdate(e, label);
    }

    render() {
        const { dropdownOptions, skillCheckBoxOptions, hideLabel } = this.props;
        return (
            <Form.Field>
                {hideLabel ? null : <label>Select Required Skills</label>}
                <Form.Dropdown
                    required
                    labeled
                    placeholder={'Search...'}
                    fluid
                    search
                    selection
                    options={dropdownOptions}
                    onChange={this.handleSearchSelect}
                />
                {
                    skillCheckBoxOptions.map(({ value, checked }, idx) => (
                        <Form.Checkbox
                            key={idx}
                            checked={checked}
                            label={value}
                            onClick={this.handleCheckBoxSelection}
                        />
                    ))
                }
            </Form.Field>
        )
    }
}