'use client';

import { Switch, IconButton, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Config } from '@/types/config';

interface ControlComponentProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function ControlComponent({ config, setConfig }: ControlComponentProps) {
  return (
    <div className="w-full flex justify-center">
      <div
        className="grid grid-rows-2 gap-y-2 justify-items-center gap-x-8"
        style={{ gridTemplateColumns: 'repeat(5, max-content)' }}
      >
        {/* Labels */}
        <Typography variant="caption" className="text-gray-600 text-center">
          Show History
          <br />
          (Last 24 Hours)
        </Typography>
        <Typography variant="caption" className="text-gray-600 text-center">
          Show Balloon ID
        </Typography>
        <Typography variant="caption" className="text-gray-600 text-center">
          ID Size
        </Typography>
        <Typography variant="caption" className="text-gray-600 text-center">
          Balloon Size
        </Typography>
        <Typography variant="caption" className="text-gray-600 text-center">
          Info Type
        </Typography>

        {/* Controls */}
        {/* Show History Switch */}
        <Switch
          checked={config.showTrails}
          onChange={() => setConfig({ ...config, showTrails: !config.showTrails })}
          color="primary"
        />

        {/* Show IDs Switch */}
        <Switch
          checked={config.showIds}
          onChange={() => setConfig({ ...config, showIds: !config.showIds })}
          color="primary"
        />

        {/* ID Size Counter */}
        <div className="flex items-center gap-1">
          <IconButton
            size="small"
            onClick={() =>
              setConfig(prev => ({
                ...prev,
                idSize: Math.max(6, prev.idSize - 1),
              }))
            }
          >
            <Remove fontSize="small" />
          </IconButton>
          <Typography variant="body2" className="min-w-[32px] text-center">
            {config.idSize}px
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              setConfig(prev => ({
                ...prev,
                idSize: Math.min(12, prev.idSize + 1),
              }))
            }
          >
            <Add fontSize="small" />
          </IconButton>
        </div>

        {/* Balloon Size Counter */}
        <div className="flex items-center gap-1">
          <IconButton
            size="small"
            onClick={() =>
              setConfig(prev => ({
                ...prev,
                balloonSize: Math.max(1, prev.balloonSize - 1),
              }))
            }
          >
            <Remove fontSize="small" />
          </IconButton>
          <Typography variant="body2" className="min-w-[32px] text-center">
            {config.balloonSize}px
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              setConfig(prev => ({
                ...prev,
                balloonSize: Math.min(5, prev.balloonSize + 1),
              }))
            }
          >
            <Add fontSize="small" />
          </IconButton>
        </div>

        {/* Info Type Dropdown */}
        <FormControl size="small" className="w-[150px]">
          <Select
            value={config.infoType}
            onChange={e => setConfig({ ...config, infoType: e.target.value as string })}
          >
            <MenuItem value="by-country">By Current Country</MenuItem>
            <MenuItem value="by-distance">By Distance</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
