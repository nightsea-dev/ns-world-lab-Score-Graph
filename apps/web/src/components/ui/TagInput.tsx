

import { TagInput, TagInputProps } from 'rsuite';

export type TagInputWrapperProps =
    & TagInputProps

export const TagInputWrapper = (
    {
        value: tags
        , onChange: setTags
        , ...rest
    }: TagInputWrapperProps
) => (<TagInput
    {...rest}
    value={tags}
    onChange={setTags}
    // trigger={['Enter', ',']}
    placeholder="Add topics…"
/>
)
